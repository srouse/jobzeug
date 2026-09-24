/**
 * Firecrawl branding scrape — Design tab session tokens only.
 * @see https://docs.firecrawl.dev/features/scrape
 */

export type BrandSnapshot = {
  colorScheme?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    textPrimary?: string;
    textSecondary?: string;
  };
  fontFamilies?: {
    primary?: string;
    heading?: string;
    code?: string;
  };
  fonts?: string[];
  fontSizes?: {
    body?: string;
    h1?: string;
  };
  fontWeights?: {
    regular?: number;
    medium?: number;
    bold?: number;
  };
  spacingBaseUnit?: number;
};

type FirecrawlBranding = {
  colorScheme?: string;
  colors?: Record<string, string | undefined>;
  fonts?: Array<{ family?: string } | string>;
  typography?: {
    fontFamilies?: Record<string, string | undefined>;
    fontSizes?: Record<string, string | undefined>;
    fontWeights?: Record<string, number | undefined>;
  };
  spacing?: {
    baseUnit?: number;
  };
};

function pickHex(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const m = value.trim().match(/#([0-9a-fA-F]{6})\b/);
  return m ? `#${m[1]!.toLowerCase()}` : undefined;
}

function trimBranding(raw: FirecrawlBranding): BrandSnapshot {
  const colors = raw.colors ?? {};
  const families = raw.typography?.fontFamilies ?? {};
  const sizes = raw.typography?.fontSizes ?? {};
  const weights = raw.typography?.fontWeights ?? {};

  const fontList = (raw.fonts ?? [])
    .map((f) => (typeof f === "string" ? f : f.family))
    .filter((f): f is string => Boolean(f?.trim()));

  return {
    colorScheme: raw.colorScheme,
    colors: {
      primary: pickHex(colors.primary),
      secondary: pickHex(colors.secondary ?? colors.accent),
      accent: pickHex(colors.accent),
      background: pickHex(colors.background),
      textPrimary: pickHex(colors.textPrimary),
      textSecondary: pickHex(colors.textSecondary),
    },
    fontFamilies: {
      primary: families.primary?.trim() || fontList[0],
      heading: families.heading?.trim() || families.primary?.trim() || fontList[0],
      code: families.code?.trim(),
    },
    fonts: fontList.slice(0, 6),
    fontSizes: {
      body: sizes.body,
      h1: sizes.h1,
    },
    fontWeights: {
      regular: weights.regular,
      medium: weights.medium,
      bold: weights.bold,
    },
    spacingBaseUnit:
      typeof raw.spacing?.baseUnit === "number" && raw.spacing.baseUnit > 0
        ? raw.spacing.baseUnit
        : undefined,
  };
}

/**
 * Scrape brand identity for a URL. Returns null on missing key / failure
 * so the design route can fall back to text-only agent.
 */
export async function scrapeBrandSnapshot(
  url: string,
): Promise<BrandSnapshot | null> {
  const apiKey = process.env.FIRECRAWL_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[design/branding] FIRECRAWL_API_KEY not configured");
    return null;
  }

  try {
    // Branding format is on the v2 scrape API (job-posting markdown still uses v1).
    const response = await fetch("https://api.firecrawl.dev/v2/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["branding"],
      }),
    });

    const body = (await response.json()) as {
      success?: boolean;
      error?: string;
      data?: { branding?: FirecrawlBranding };
    };

    if (!response.ok || body.success === false) {
      console.warn(
        "[design/branding]",
        body.error || `scrape failed (${response.status})`,
      );
      return null;
    }

    const branding = body.data?.branding;
    if (!branding || typeof branding !== "object") {
      console.warn("[design/branding] empty branding payload");
      return null;
    }

    return trimBranding(branding);
  } catch (err) {
    console.warn(
      "[design/branding]",
      err instanceof Error ? err.message : "scrape error",
    );
    return null;
  }
}
