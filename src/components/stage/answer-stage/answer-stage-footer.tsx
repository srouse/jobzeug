"use client";

import { JzButton, JzInput, JzTag } from "@jobzeug/design-system/react";

import type { AskContextItem } from "@/components/resume";

import styles from "./answer-stage.module.css";

function jzInputValue(event: Event): string {
  const host = event.currentTarget as HTMLElement & { value?: string };
  return typeof host.value === "string" ? host.value : "";
}

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
        <JzInput
          className={styles.input}
          value={input}
          aria-label="Question"
          onInput={(event: Event) => {
            if (busy) return;
            onInputChange(jzInputValue(event));
          }}
          onKeyDown={(event: KeyboardEvent) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            (event.currentTarget as HTMLElement | null)
              ?.closest("form")
              ?.requestSubmit();
          }}
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
