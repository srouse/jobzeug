import { createClient, type PlainClientAPI } from "contentful-management";

import { contentfulOAuthConfig } from "./oauth";

const PROJECT_ID = /^S\d{3,}$/;
const BLURB_MAX = 600;
/** Contentful Symbol fields hold 256 characters. Both metric fields are Symbols. */
const METRIC_MAX = 256;
const VIDEO_MAX_BYTES = 80 * 1024 * 1024;
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export class PresentationWriteError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export type PresentationText = {
  blurb: string;
  metricOneValue: string;
  metricOneLabel: string;
  metricTwoValue: string;
  metricTwoLabel: string;
};

export type PresentationVideoFile = {
  name: string;
  type: string;
  bytes: ArrayBuffer;
};

export function assertProjectId(projectId: string): string {
  const id = projectId.trim();
  if (!PROJECT_ID.test(id)) {
    throw new PresentationWriteError("Unknown project.", 404);
  }
  return id;
}

export function parsePresentationText(input: {
  blurb?: unknown;
  metricOneValue?: unknown;
  metricOneLabel?: unknown;
  metricTwoValue?: unknown;
  metricTwoLabel?: unknown;
}): PresentationText | null {
  const present = [
    input.blurb,
    input.metricOneValue,
    input.metricOneLabel,
    input.metricTwoValue,
    input.metricTwoLabel,
  ].some((value) => value !== undefined);
  if (!present) return null;
  return {
    blurb: boundedText(input.blurb, BLURB_MAX, "Blurb"),
    metricOneValue: boundedText(input.metricOneValue, METRIC_MAX, "Metric value"),
    metricOneLabel: boundedText(input.metricOneLabel, METRIC_MAX, "Metric label"),
    metricTwoValue: boundedText(input.metricTwoValue, METRIC_MAX, "Metric value"),
    metricTwoLabel: boundedText(input.metricTwoLabel, METRIC_MAX, "Metric label"),
  };
}

export async function parsePresentationVideo(
  file: File | null,
): Promise<PresentationVideoFile | null> {
  if (!file || file.size === 0) return null;
  const type = videoContentType(file);
  if (!type) {
    throw new PresentationWriteError("Use an MP4, WebM, or QuickTime video.", 400);
  }
  if (file.size > VIDEO_MAX_BYTES) {
    throw new PresentationWriteError("Video must be 80 MB or smaller.", 400);
  }
  return {
    name: safeFileName(file.name, type),
    type,
    bytes: await file.arrayBuffer(),
  };
}

export async function savePresentation(input: {
  token: string;
  projectId: string;
  text: PresentationText | null;
  video: PresentationVideoFile | null;
}): Promise<void> {
  if (!input.text && !input.video) {
    throw new PresentationWriteError("Send the blurb and metrics, or a video.", 400);
  }
  const config = contentfulOAuthConfig();
  if (!config) {
    throw new PresentationWriteError("Contentful OAuth is not configured.", 503);
  }
  const projectId = assertProjectId(input.projectId);
  const client = plainClient(input.token);
  const params = { spaceId: config.spaceId, environmentId: config.environmentId };

  let entry;
  try {
    const project = await client.entry.get({ ...params, entryId: `jz-${projectId}` });
    const entryId = presentationLinkId(project.fields.presentation, config.locale);
    if (!entryId) {
      throw new PresentationWriteError("No presentation for this project.", 404);
    }
    entry = await client.entry.get({ ...params, entryId });
  } catch (error) {
    throw mapContentfulError(error);
  }
  const contentTypeId = entry.sys.contentType?.sys?.id;
  if (contentTypeId !== "jobzeugProjectPresentation") {
    throw new PresentationWriteError("No presentation for this project.", 404);
  }

  const fields: Record<string, unknown> = { ...entry.fields };
  if (input.video) {
    const existingId = linkedAssetId(entry.fields.video, config.locale);
    const asset = await publishVideoAsset(
      client,
      params,
      config.locale,
      input.video,
      existingId,
    );
    fields.video = {
      [config.locale]: {
        sys: { type: "Link", linkType: "Asset", id: asset.sys.id },
      },
    };
  }
  if (input.text) {
    fields.blurb = { [config.locale]: input.text.blurb };
    fields.metricOneValue = { [config.locale]: input.text.metricOneValue };
    fields.metricOneLabel = { [config.locale]: input.text.metricOneLabel };
    fields.metricTwoValue = { [config.locale]: input.text.metricTwoValue };
    fields.metricTwoLabel = { [config.locale]: input.text.metricTwoLabel };
  }

  const entryId = entry.sys.id;
  try {
    const updated = await client.entry.update(
      { ...params, entryId },
      { ...entry, fields: fields as typeof entry.fields },
    );
    await client.entry.publish({ ...params, entryId }, updated);
  } catch (error) {
    throw mapContentfulError(error);
  }
}

/** CMA reference fields are localized: `{ "en-US": { sys: { id } } }`. */
function presentationLinkId(value: unknown, locale: string): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  const localized = record[locale];
  const candidate =
    localized && typeof localized === "object" ? localized : record;
  const sys = (candidate as { sys?: { type?: string; linkType?: string; id?: string } }).sys;
  if (sys?.type === "Link" && sys.linkType === "Entry" && sys.id) return sys.id;
  return undefined;
}

function plainClient(token: string): PlainClientAPI {
  return createClient({ accessToken: token }, { type: "plain" });
}

const VIDEO_PROCESSING = { processingCheckWait: 2000, processingCheckRetries: 30 };

function linkedAssetId(value: unknown, locale: string): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  const localized = record[locale];
  const candidate = localized && typeof localized === "object" ? localized : record;
  const sys = (candidate as { sys?: { type?: string; linkType?: string; id?: string } }).sys;
  if (sys?.id && (sys.linkType === "Asset" || sys.type === "Asset")) return sys.id;
  return undefined;
}

function videoContentType(file: File): string | null {
  if (VIDEO_TYPES.has(file.type)) return file.type;
  const name = file.name.toLowerCase();
  if (name.endsWith(".mp4")) return "video/mp4";
  if (name.endsWith(".webm")) return "video/webm";
  if (name.endsWith(".mov") || name.endsWith(".qt")) return "video/quicktime";
  return null;
}

async function publishVideoAsset(
  client: PlainClientAPI,
  params: { spaceId: string; environmentId: string },
  locale: string,
  video: PresentationVideoFile,
  existingAssetId: string | undefined,
) {
  if (existingAssetId) {
    try {
      return await replaceVideoAsset(client, params, locale, existingAssetId, video);
    } catch (error) {
      if (contentfulStatus(error) !== 404) throw mapContentfulError(error);
    }
  }
  return createVideoAsset(client, params, locale, video);
}

async function createVideoAsset(
  client: PlainClientAPI,
  params: { spaceId: string; environmentId: string },
  locale: string,
  video: PresentationVideoFile,
) {
  try {
    const created = await client.asset.createFromFiles(params, {
      fields: {
        title: { [locale]: video.name },
        description: { [locale]: video.name },
        file: {
          [locale]: {
            file: video.bytes,
            contentType: video.type,
            fileName: video.name,
          },
        },
      },
    });
    const processed = await client.asset.processForAllLocales(params, created, VIDEO_PROCESSING);
    return await client.asset.publish(
      { ...params, assetId: processed.sys.id },
      processed,
    );
  } catch (error) {
    throw mapContentfulError(error);
  }
}

async function replaceVideoAsset(
  client: PlainClientAPI,
  params: { spaceId: string; environmentId: string },
  locale: string,
  assetId: string,
  video: PresentationVideoFile,
) {
  const current = await client.asset.get({ ...params, assetId });
  const upload = (await client.upload.create(params, { file: video.bytes })) as {
    sys?: { id?: string };
  };
  const uploadId = upload.sys?.id;
  if (!uploadId) {
    throw new PresentationWriteError("Could not save the presentation.", 502);
  }
  const updated = await client.asset.update(
    { ...params, assetId },
    {
      ...current,
      fields: {
        ...current.fields,
        title: {
          ...current.fields.title,
          [locale]: current.fields.title?.[locale] || video.name,
        },
        file: {
          ...current.fields.file,
          [locale]: {
            contentType: video.type,
            fileName: video.name,
            uploadFrom: {
              sys: { type: "Link", linkType: "Upload", id: uploadId },
            },
          },
        },
      },
    },
  );
  const processed = await client.asset.processForAllLocales(params, updated, VIDEO_PROCESSING);
  return client.asset.publish({ ...params, assetId: processed.sys.id }, processed);
}

function boundedText(value: unknown, max: number, label: string): string {
  if (typeof value !== "string") {
    throw new PresentationWriteError(`Send the blurb and both metrics together.`, 400);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new PresentationWriteError(`${label} is required.`, 400);
  }
  if (trimmed.length > max) {
    throw new PresentationWriteError(`${label} must be ${max} characters or fewer.`, 400);
  }
  return trimmed;
}

function safeFileName(name: string, type: string): string {
  const base = name.split(/[/\\]/).pop()?.replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "");
  if (base) return base.slice(0, 120);
  if (type === "video/webm") return "presentation.webm";
  if (type === "video/quicktime") return "presentation.mov";
  return "presentation.mp4";
}

function contentfulStatus(error: unknown): number | undefined {
  const err = error as { status?: number; statusCode?: number; name?: string; message?: string };
  if (typeof err?.status === "number") return err.status;
  if (typeof err?.statusCode === "number") return err.statusCode;
  if (err?.name === "VersionMismatch") return 409;
  if (err?.name === "AssetProcessingTimeout") return 504;
  try {
    const body = typeof err?.message === "string" ? JSON.parse(err.message) : null;
    if (typeof body?.status === "number") return body.status;
  } catch {
    return undefined;
  }
  return undefined;
}

function mapContentfulError(error: unknown): PresentationWriteError {
  if (error instanceof PresentationWriteError) return error;
  const status = contentfulStatus(error);
  if (status === 409) {
    return new PresentationWriteError(
      "This presentation changed in Contentful. Reload and try again.",
      409,
    );
  }
  if (status === 403) {
    return new PresentationWriteError(
      "You can view this environment but cannot change entries.",
      403,
    );
  }
  if (status === 401) {
    return new PresentationWriteError(
      "Contentful login expired. Open /contentful and sign in again.",
      401,
    );
  }
  if (status === 404) {
    return new PresentationWriteError("No presentation for this project.", 404);
  }
  if (status === 504) {
    return new PresentationWriteError("The video is still processing. Try the replace again.", 504);
  }
  return new PresentationWriteError("Could not save the presentation.", 502);
}
