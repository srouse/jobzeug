/**
 * Resolve “mimic State Farm’s website” style asks → official homepage URL.
 * Design tab only — Firecrawl search, no second LLM.
 */

const URL_RE = /https?:\/\/[^\s<>"')\]]+/i;

const MIMIC_RE =
  /\b(mimic|imitate|copy|match|inspired\s+by|based\s+on|look\s+like|feel\s+like|like\s+the|whats?\s+on|resembl[ei])\b/i;

const SITE_RE =
  /\b(website|web\s*site|site|homepage|home\s*page|branding|brand)\b/i;

const NOISE_PHRASE_RE =
  /\b(can\s+you|could\s+you|please|just|make\s+(it|this)|use|get|pull|from|their|the|a|an|of|on|for|to|and|or|with|whats?\s+on|whats)\b/gi;

const SKIP_HOST_RE =
  /(wikipedia\.org|wikidata\.org|apps\.apple\.com|play\.google\.com|linkedin\.com|facebook\.com|fb\.com|instagram\.com|twitter\.com|x\.com|youtube\.com|youtu\.be|reddit\.com|tiktok\.com|pinterest\.com|amazon\.com|ebay\.com|glassdoor\.com|indeed\.com|bloomberg\.com|forbes\.com|nytimes\.com|cnn\.com|bbc\.(com|co\.uk)|crunchbase\.com)/i;

const SKIP_PATH_RE =
  /\/(login|signin|sign-in|signup|sign-up|careers?|jobs?|news|press|blog|support|help|app|download|store|cart|checkout)(\/|$)/i;

export function extractUrlFromMessage(message: string): string | null {
  const match = message.match(URL_RE);
  if (!match) return null;
  try {
    const url = new URL(match[0]!.replace(/[.,;:!?)]+$/, ""));
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** True when the message asks to mimic a named site/brand but has no URL. */
export function isBrandMimicIntent(message: string): boolean {
  if (extractUrlFromMessage(message)) return false;
  const hasMimic = MIMIC_RE.test(message);
  const hasSite = SITE_RE.test(message);
  const words = message.trim().split(/\s+/).length;
  // "mimic State Farm's website" / "like Stripe's site" / "what's on Linear homepage"
  if (hasMimic && hasSite) return true;
  if (hasMimic && words >= 3) return true;
  // "State Farm Insurance website look" — site word + enough content
  if (hasSite && words >= 4) return true;
  return false;
}

/**
 * Pull a search query from a mimic ask.
 * e.g. "Can you mimic what's on State Farm Insurance's website?"
 *   → "State Farm Insurance official website"
 */
export function extractBrandSearchQuery(message: string): string | null {
  let text = message.trim();
  text = text.replace(URL_RE, " ");
  text = text.replace(MIMIC_RE, " ");
  text = text.replace(SITE_RE, " ");
  text = text.replace(NOISE_PHRASE_RE, " ");
  text = text.replace(/['’]s\b/gi, " ");
  text = text.replace(/[?!.,;:"“”]+/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  if (text.length < 2 || text.length > 80) return null;
  return `${text} official website`;
}

type SearchHit = {
  url: string;
  title?: string;
  description?: string;
};

function hostnameScore(hostname: string, brandTokens: string[]): number {
  const host = hostname.replace(/^www\./, "").toLowerCase();
  let score = 0;
  for (const token of brandTokens) {
    if (token.length < 3) continue;
    if (host.includes(token)) score += 8;
  }
  // Prefer shorter apex-looking hosts
  const parts = host.split(".");
  if (parts.length <= 3) score += 2;
  return score;
}

function pathScore(pathname: string): number {
  if (pathname === "/" || pathname === "") return 6;
  if (SKIP_PATH_RE.test(pathname)) return -20;
  const depth = pathname.split("/").filter(Boolean).length;
  return Math.max(-4, 4 - depth * 2);
}

function titleScore(title: string, brandTokens: string[]): number {
  const t = title.toLowerCase();
  let score = 0;
  for (const token of brandTokens) {
    if (token.length < 3) continue;
    if (t.includes(token)) score += 4;
  }
  return score;
}

function brandTokensFromQuery(query: string): string[] {
  return query
    .replace(/\bofficial\b/gi, " ")
    .replace(/\bwebsite\b/gi, " ")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3);
}

/** Rank Firecrawl search hits; return best official homepage or null. */
export function pickOfficialHomepage(
  hits: SearchHit[],
  brandQuery: string,
): string | null {
  const tokens = brandTokensFromQuery(brandQuery);
  let best: { url: string; score: number } | null = null;

  for (const hit of hits) {
    let url: URL;
    try {
      url = new URL(hit.url);
    } catch {
      continue;
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") continue;
    if (SKIP_HOST_RE.test(url.hostname)) continue;

    let score =
      hostnameScore(url.hostname, tokens) +
      pathScore(url.pathname) +
      titleScore(hit.title ?? "", tokens) +
      titleScore(hit.description ?? "", tokens);

    if (url.hostname.startsWith("www.")) score += 1;

    // Prefer marketing homepage (origin) when path is shallow
    const candidate =
      url.pathname === "/" || url.pathname === "" || pathScore(url.pathname) >= 2
        ? url.origin
        : `${url.origin}${url.pathname.replace(/\/$/, "")}`;

    if (!best || score > best.score) {
      best = { url: candidate, score };
    }
  }

  if (!best || best.score < 6) return null;
  return best.url;
}

async function firecrawlSearch(query: string): Promise<SearchHit[]> {
  const apiKey = process.env.FIRECRAWL_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[design/resolve] FIRECRAWL_API_KEY not configured");
    return [];
  }

  try {
    const response = await fetch("https://api.firecrawl.dev/v2/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        limit: 5,
      }),
    });

    const body = (await response.json()) as {
      success?: boolean;
      error?: string;
      data?: SearchHit[] | { web?: SearchHit[] };
    };

    if (!response.ok || body.success === false) {
      console.warn(
        "[design/resolve]",
        body.error || `search failed (${response.status})`,
      );
      return [];
    }

    const data = body.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.web)) return data.web;
    return [];
  } catch (err) {
    console.warn(
      "[design/resolve]",
      err instanceof Error ? err.message : "search error",
    );
    return [];
  }
}

export type ResolvedBrandSite = {
  url: string;
  searchQuery: string;
};

/**
 * Resolve a brand-mimic message (no URL) to an official homepage.
 * Returns null when intent is unclear or search cannot pick a site.
 */
export async function resolveBrandSiteFromMessage(
  message: string,
): Promise<ResolvedBrandSite | null> {
  if (!isBrandMimicIntent(message)) return null;
  const searchQuery = extractBrandSearchQuery(message);
  if (!searchQuery) return null;

  const hits = await firecrawlSearch(searchQuery);
  const url = pickOfficialHomepage(hits, searchQuery);
  if (!url) return null;
  return { url, searchQuery };
}
