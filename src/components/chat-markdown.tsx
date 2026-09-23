"use client";

import type { ComponentPropsWithoutRef } from "react";
import Markdown from "react-markdown";
import { JzText } from "@jobzeug/design-system/react";

import styles from "./chat-markdown.module.css";

const markdownComponents = {
  p: ({ children }: ComponentPropsWithoutRef<"p">) => (
    <JzText variant="caption" className={styles.mdP}>
      {children}
    </JzText>
  ),
  ul: ({ children }: ComponentPropsWithoutRef<"ul">) => (
    <ul className={styles.mdUl}>{children}</ul>
  ),
  ol: ({ children }: ComponentPropsWithoutRef<"ol">) => (
    <ol className={styles.mdOl}>{children}</ol>
  ),
  li: ({ children }: ComponentPropsWithoutRef<"li">) => (
    <li className={styles.mdLi}>
      <JzText variant="caption">{children}</JzText>
    </li>
  ),
  strong: ({ children }: ComponentPropsWithoutRef<"strong">) => (
    <JzText variant="body-strong">{children}</JzText>
  ),
  em: ({ children }: ComponentPropsWithoutRef<"em">) => <em>{children}</em>,
  a: ({ href, children }: ComponentPropsWithoutRef<"a">) => {
    const internal = href?.startsWith("#");
    return (
      <a
        href={href}
        className={styles.mdLink}
        {...(internal ? {} : { target: "_blank", rel: "noreferrer" })}
      >
        <JzText variant="caption" color="primary">
          {children}
        </JzText>
      </a>
    );
  },
  code: ({ children }: ComponentPropsWithoutRef<"code">) => (
    <code className={styles.mdCode}>{children}</code>
  ),
  pre: ({ children }: ComponentPropsWithoutRef<"pre">) => (
    <pre className={styles.mdPre}>{children}</pre>
  ),
  h1: ({ children }: ComponentPropsWithoutRef<"h1">) => (
    <JzText level={3} variant="label" className={styles.mdHeading}>
      {children}
    </JzText>
  ),
  h2: ({ children }: ComponentPropsWithoutRef<"h2">) => (
    <JzText level={3} variant="label" className={styles.mdHeading}>
      {children}
    </JzText>
  ),
  h3: ({ children }: ComponentPropsWithoutRef<"h3">) => (
    <JzText level={3} variant="label" className={styles.mdHeading}>
      {children}
    </JzText>
  ),
  blockquote: ({ children }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className={styles.mdQuote}>
      <JzText variant="caption" color="muted">
        {children}
      </JzText>
    </blockquote>
  ),
};

export function ChatMarkdown({ markdown }: { markdown: string }) {
  return (
    <div className={styles.mdRoot}>
      <Markdown components={markdownComponents}>{markdown}</Markdown>
    </div>
  );
}
