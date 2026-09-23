/**
 * Firecrawl scrape — isolated to job-posting feature.
 * @see https://www.firecrawl.dev/
 */
export async function scrapeJobListingMarkdown(url: string): Promise<string> {
  const apiKey = process.env.FIRECRAWL_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("FIRECRAWL_API_KEY is not configured");
  }

  const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
      onlyMainContent: true,
    }),
  });

  const body = (await response.json()) as {
    success?: boolean;
    error?: string;
    data?: { markdown?: string };
  };

  if (!response.ok || body.success === false) {
    throw new Error(body.error || `Firecrawl scrape failed (${response.status})`);
  }

  const markdown = body.data?.markdown?.trim();
  if (!markdown) {
    throw new Error("Firecrawl returned empty markdown");
  }
  return markdown;
}
