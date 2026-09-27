import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isKleioEnabled, kleioRoot } from "@/lib/kleio/enabled";
import { scanKleio, type KleioGroup } from "@/lib/kleio/scan";

import { KleioBrowser } from "./kleio-browser";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "KLEIO images",
  robots: { index: false, follow: false },
};

export default async function KleioPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string; image?: string }>;
}) {
  if (!isKleioEnabled()) notFound();

  const scan = await scanKleio();
  if (!scan.ok) {
    return <KleioBrowser groups={[]} initialSelection={null} unavailableRoot={kleioRoot()} />;
  }

  const params = await searchParams;
  return (
    <KleioBrowser
      groups={scan.groups}
      initialSelection={initialSelection(scan.groups, params.project, params.image)}
    />
  );
}

function initialSelection(
  groups: KleioGroup[],
  projectId: string | undefined,
  image: string | undefined,
) {
  const index = Number(image);
  const requested = groups.find((group) => group.id === projectId);
  if (requested && Number.isInteger(index) && requested.images[index]) {
    return { projectId: requested.id, index };
  }
  const first = groups.find((group) => group.images.length > 0);
  if (!first) return null;
  return { projectId: first.id, index: 0 };
}
