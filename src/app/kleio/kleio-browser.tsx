"use client";

import { useCallback, useEffect, useState } from "react";
import { JzText } from "@jobzeug/design-system/react";

import type { KleioGroup } from "@/lib/kleio/scan";

import styles from "./kleio.module.css";

type Selection = {
  projectId: string;
  index: number;
};

export function KleioBrowser({
  groups,
  initialSelection,
  unavailableRoot,
}: {
  groups: KleioGroup[];
  initialSelection: Selection | null;
  unavailableRoot?: string;
}) {
  const [selection, setSelection] = useState<Selection | null>(initialSelection);

  const group = groups.find((item) => item.id === selection?.projectId);
  const image = group && selection ? group.images[selection.index] : undefined;

  const select = useCallback((next: Selection) => {
    const url = new URL(window.location.href);
    url.searchParams.set("project", next.projectId);
    url.searchParams.set("image", String(next.index));
    window.history.replaceState(null, "", url);
    setSelection(next);
  }, []);

  function selectProject(projectId: string) {
    if (selection?.projectId === projectId) return;
    select({ projectId, index: 0 });
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (unavailableRoot || !selection || !group || group.images.length === 0) return;
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const index = selection.index + delta;
      if (index < 0 || index >= group.images.length) return;
      select({ projectId: selection.projectId, index });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [unavailableRoot, selection, group, select]);

  useEffect(() => {
    if (!selection) return;
    document
      .getElementById(`kleio-${selection.projectId}-${selection.index}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selection]);

  if (unavailableRoot) {
    return (
      <main className={styles.missing}>
        <JzText
          variant="body-default"
          color="muted"
          label={`KLEIO folder is not available at ${unavailableRoot}.`}
        />
      </main>
    );
  }

  return (
    <div className={styles.root}>
      <nav className={styles.projects} aria-label="Projects">
        <ul className={styles.list}>
          {groups.map((item) => {
            const active = item.id === selection?.projectId;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={
                    item.images.length === 0 && !active
                      ? `${styles.item} ${styles.empty}`
                      : styles.item
                  }
                  aria-current={active ? "true" : undefined}
                  onClick={() => selectProject(item.id)}
                >
                  <JzText
                    variant="label"
                    color={
                      active ? "warning" : item.images.length === 0 ? "muted" : "default"
                    }
                    label={projectLabel(item)}
                    className={styles.projectLabel}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <nav className={styles.images} aria-label="Images">
        {group && group.images.length > 0 ? (
          <ul className={styles.list}>
            {group.images.map((item, index) => {
              const active = selection?.index === index;
              const fromWork = item.archive === "work";
              return (
                <li key={item.relativePath}>
                  <button
                    id={`kleio-${group.id}-${index}`}
                    type="button"
                    className={styles.item}
                    aria-current={active ? "true" : undefined}
                    onClick={() => select({ projectId: group.id, index })}
                  >
                    <JzText
                      variant="caption"
                      color={active ? "warning" : fromWork ? "primary" : "default"}
                      label={item.label}
                      className={styles.itemLabel}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <JzText variant="caption" color="default" label="No images" />
        )}
      </nav>
      <main className={styles.stage}>
        {image && group && selection ? (
          <>
            {isPdf(image.label) ? (
              <iframe className={styles.frame} title={image.label} src={mediaUrl(image)} />
            ) : (
              // Streamed from the local archive. next/image would copy the file.
              // eslint-disable-next-line @next/next/no-img-element
              <img className={styles.image} alt={image.label} src={mediaUrl(image)} />
            )}
            <div className={styles.caption}>
              <JzText
                variant="caption"
                color="secondary"
                label={`${projectLabel(group)} · ${selection.index + 1} / ${group.images.length}`}
              />
              <JzText
                variant="caption"
                color={image.archive === "work" ? "primary" : "muted"}
                label={image.archive === "work" ? `workProjects · ${image.label}` : image.label}
              />
              <JzText
                variant="caption"
                color="muted"
                label={image.absolutePath}
                className={styles.path}
              />
            </div>
          </>
        ) : (
          <JzText variant="body-default" color="muted" label="No image selected." />
        )}
      </main>
    </div>
  );
}

function projectLabel(group: KleioGroup): string {
  const work = group.images.filter((image) => image.archive === "work").length;
  const count =
    work > 0 ? `(${group.images.length}, ${work} work)` : `(${group.images.length})`;
  if (group.id === "unassigned") return `${group.title} ${count}`;
  return `${group.id} ${count} · ${group.title}`;
}

function mediaUrl(image: KleioGroup["images"][number]): string {
  const params = new URLSearchParams({ path: image.relativePath });
  if (image.archive === "work") params.set("root", "work");
  return `/api/kleio?${params}`;
}

function isPdf(label: string): boolean {
  return label.toLowerCase().endsWith(".pdf");
}
