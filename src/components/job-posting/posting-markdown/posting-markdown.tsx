"use client";

import type { ComponentPropsWithoutRef } from "react";
import Markdown from "react-markdown";
import { JzText } from "@jobzeug/design-system/react";

import styles from "./posting-markdown.module.css";

const markdownComponents = {
  p: ({ children }: ComponentPropsWithoutRef<"p">) => (
    <JzText variant="body-default" className={styles.block}>
      {children}
    </JzText>
  ),
  h1: ({ children }: ComponentPropsWithoutRef<"h1">) => (
    <JzText level={3} variant="heading" className={styles.heading}>
      {children}
    </JzText>
  ),
  h2: ({ children }: ComponentPropsWithoutRef<"h2">) => (
    <JzText level={4} variant="heading2" className={styles.heading}>
      {children}
    </JzText>
  ),
  h3: ({ children }: ComponentPropsWithoutRef<"h3">) => (
    <JzText level={5} variant="heading3" className={styles.heading}>
      {children}
    </JzText>
  ),
  h4: ({ children }: ComponentPropsWithoutRef<"h4">) => (
    <JzText level={6} variant="label" className={styles.heading}>
      {children}
    </JzText>
  ),
  h5: ({ children }: ComponentPropsWithoutRef<"h5">) => (
    <JzText level={6} variant="label" className={styles.heading}>
      {children}
    </JzText>
  ),
  h6: ({ children }: ComponentPropsWithoutRef<"h6">) => (
    <JzText level={6} variant="label" className={styles.heading}>
      {children}
    </JzText>
  ),
  li: ({ children }: ComponentPropsWithoutRef<"li">) => (
    <li>
      <JzText variant="body-default" className={styles.block}>
        {children}
      </JzText>
    </li>
  ),
  a: ({ href, children }: ComponentPropsWithoutRef<"a">) => (
    <a
      href={href}
      className={styles.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className={styles.quote}>{children}</blockquote>
  ),
};

/** Render a scraped job listing (Firecrawl markdown) as document HTML. */
export function PostingMarkdown({ markdown }: { markdown: string }) {
  return (
    <div className={styles.root}>
      <Markdown components={markdownComponents}>{markdown}</Markdown>
    </div>
  );
}
