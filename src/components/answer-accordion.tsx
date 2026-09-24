"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  JzAccordion,
  JzAccordionItem,
} from "@jobzeug/design-system/react";

export type AnswerAccordionItem = {
  id: string;
  title: string;
  body: ReactNode;
};

type AccordionChangeDetail = {
  openItem?: string;
};

/**
 * Single-open accordion over design-system `JzAccordion` / `JzAccordionItem`.
 */
export function AnswerAccordion({
  items,
  resetKey,
  onOpenItemChange,
}: {
  items: AnswerAccordionItem[];
  /** When this changes (e.g. new cluster id), reopen the first item. */
  resetKey?: string;
  onOpenItemChange?: (id: string) => void;
}) {
  const [openItem, setOpenItem] = useState("");

  useEffect(() => {
    const next = items[0]?.id ?? "0";
    setOpenItem(next);
    onOpenItemChange?.(items[0]?.id ?? "");
    // Intentionally only when the answer identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  if (!items.length) return null;

  const resolvedOpenItem =
    openItem === ""
      ? ""
      : openItem && items.some((item) => item.id === openItem)
        ? openItem
        : (items[0]?.id ?? "0");

  return (
    <JzAccordion
      openItem={resolvedOpenItem}
      onChange={(event: Event) => {
        const detail = (event as CustomEvent<AccordionChangeDetail>).detail;
        if (typeof detail?.openItem !== "string") return;
        setOpenItem(detail.openItem);
        onOpenItemChange?.(detail.openItem);
      }}
    >
      {items.map((item) => (
        <JzAccordionItem
          key={item.id}
          value={item.id}
          title={item.title}
          description=""
          showSubtitle={false}
          showSlot
        >
          <div style={{ width: "100%", minWidth: 0 }}>{item.body}</div>
        </JzAccordionItem>
      ))}
    </JzAccordion>
  );
}
