import { createClient, type PlainClientAPI } from "contentful-management";

import { getDeliveryClient } from "@/lib/contentful/delivery";

const CONTENT_TYPE_ID = "jobzeugFocusBrief";

function requireCmaEnv() {
  const space = process.env.CONTENTFUL_SPACE_ID?.trim();
  const environment = process.env.CONTENTFUL_ENVIRONMENT?.trim();
  const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN?.trim();
  const locale = process.env.CONTENTFUL_LOCALE?.trim() || "en-US";
  const missing = [
    !space && "CONTENTFUL_SPACE_ID",
    !environment && "CONTENTFUL_ENVIRONMENT",
    !token && "CONTENTFUL_MANAGEMENT_TOKEN",
  ].filter(Boolean);
  if (missing.length) {
    throw new Error(`Missing Contentful CMA env: ${missing.join(", ")}`);
  }
  return { space: space!, environment: environment!, token: token!, locale };
}

function isStatus(error: unknown, status: number, name: string): boolean {
  const err = error as { name?: string; status?: number; message?: string };
  if (err?.name === name || err?.status === status) return true;
  try {
    const body =
      typeof err?.message === "string" ? JSON.parse(err.message) : null;
    return body?.status === status || body?.sys?.id === name;
  } catch {
    return false;
  }
}

function paragraphFrom(entry: { fields?: unknown }, locale: string): string | null {
  const fields = entry.fields as
    | Record<string, Record<string, unknown> | unknown>
    | undefined;
  const raw = fields?.paragraph;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  const localized = raw as Record<string, unknown> | undefined;
  const value = localized?.[locale] ?? localized?.["en-US"];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function clientFor(token: string): PlainClientAPI {
  return createClient({ accessToken: token }, { type: "plain" });
}

/** Published brief from Delivery. A missing entry returns null. */
export async function readFocusBrief(entryId: string): Promise<string | null> {
  const locale = process.env.CONTENTFUL_LOCALE?.trim() || "en-US";
  const client = getDeliveryClient();
  try {
    const entry = await client.getEntry(entryId, { locale });
    return paragraphFrom(entry, locale);
  } catch (error) {
    if (isStatus(error, 404, "NotFound")) return null;
    throw error;
  }
}

/**
 * Write the paragraph onto the existing brief and publish it.
 * Creates the entry when none exists yet.
 */
export async function replaceFocusBrief(
  entryId: string,
  paragraph: string,
): Promise<string> {
  const { space, environment, token, locale } = requireCmaEnv();
  const client = clientFor(token);
  const params = { spaceId: space, environmentId: environment };
  const entryParams = { ...params, entryId };
  const fields = { paragraph: { [locale]: paragraph } };
  try {
    const existing = await client.entry.get(entryParams);
    const updated = await client.entry.update(entryParams, {
      ...existing,
      fields: { ...existing.fields, ...fields },
    });
    await client.entry.publish(entryParams, updated);
    return paragraph;
  } catch (error) {
    if (!isStatus(error, 404, "NotFound")) throw error;
    return createFocusBrief(entryId, paragraph);
  }
}

/**
 * Create and publish the brief. A 409 means another request created it;
 * return that paragraph.
 */
export async function createFocusBrief(
  entryId: string,
  paragraph: string,
): Promise<string> {
  const { space, environment, token, locale } = requireCmaEnv();
  const client = clientFor(token);
  const params = { spaceId: space, environmentId: environment };
  const entryParams = { ...params, entryId };
  try {
    const created = await client.entry.createWithId(
      { ...params, entryId, contentTypeId: CONTENT_TYPE_ID },
      { fields: { paragraph: { [locale]: paragraph } } },
    );
    await client.entry.publish(entryParams, created);
    return paragraph;
  } catch (error) {
    if (!isStatus(error, 409, "Conflict")) throw error;
    const existing = await client.entry.get(entryParams);
    const stored = paragraphFrom(existing, locale);
    if (!stored) throw error;
    return stored;
  }
}
