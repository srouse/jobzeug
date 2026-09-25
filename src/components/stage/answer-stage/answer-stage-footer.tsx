"use client";

import { JzButton, JzTag } from "@jobzeug/design-system/react";

import type { AskContextItem } from "@/components/resume";

import styles from "./answer-stage.module.css";

export function AnswerStageFooter({
  showComposer,
  askContextItems,
  onRemoveContext,
  input,
  onInputChange,
  onResumeSubmit,
  canSubmitResume,
  busy,
}: {
  showComposer: boolean;
  askContextItems: AskContextItem[];
  onRemoveContext: (id: string) => void;
  input: string;
  onInputChange: (value: string) => void;
  onResumeSubmit: (e: React.FormEvent) => void;
  canSubmitResume: boolean;
  busy: boolean;
}) {
  if (!showComposer) return null;

  return (
    <div
      className={styles.composerBar}
      data-answer-stage-footer
    >
      {askContextItems.length > 0 ? (
        <div className={styles.contextRow} aria-label="Attached context">
          {askContextItems.map((item) => (
            <JzTag
              key={item.id}
              variant="outline"
              label={item.label}
              title={item.text}
              href="#remove-context"
              onClick={(event: Event) => {
                event.preventDefault();
                onRemoveContext(item.id);
              }}
            />
          ))}
        </div>
      ) : null}
      <form onSubmit={onResumeSubmit} className={styles.composer}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Ask a question…"
          disabled={busy}
          aria-label="Question"
        />
        <JzButton
          label="Answer"
          variant="primary"
          size="small"
          disabled={!canSubmitResume}
          showIcon={false}
          onClick={(event: Event) => {
            (event.currentTarget as HTMLElement | null)
              ?.closest("form")
              ?.requestSubmit();
          }}
        />
      </form>
    </div>
  );
}
