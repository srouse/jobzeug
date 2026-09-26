import "server-only";

import { fetchMatchingCatalog } from "../../../scripts/contentful/matching/published-catalog.mjs";
import { getDeliveryClient } from "@/lib/contentful/delivery";

/** Published structured evidence for a deterministic engine. No filesystem or AI fallback. */
export async function loadMatchingCatalog() {
  return fetchMatchingCatalog(getDeliveryClient(), {
    locale: process.env.CONTENTFUL_LOCALE?.trim() || "en-US",
  });
}
