import type { Metadata } from "next";
import { cookies } from "next/headers";

import {
  CONTENTFUL_OAUTH_COOKIE,
  contentfulOAuthConfig,
  readContentfulAccess,
} from "@/lib/contentful/oauth";

import { ContentfulPageClient } from "./contentful-page-client";

export const metadata: Metadata = {
  title: "Contentful",
};

export default async function ContentfulPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const config = contentfulOAuthConfig();
  const jar = await cookies();
  const access = await readContentfulAccess(jar.get(CONTENTFUL_OAUTH_COOKIE)?.value);
  return (
    <ContentfulPageClient
      configured={config != null}
      status={access.status}
      name={access.status === "anonymous" ? undefined : access.name}
      spaceId={config?.spaceId}
      environmentId={config?.environmentId}
      error={params.error}
    />
  );
}
