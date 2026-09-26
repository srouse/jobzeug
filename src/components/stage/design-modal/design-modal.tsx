"use client";

import { JzButton, JzInput } from "@jobzeug/design-system/react";

import { Modal } from "@/components/modal";
import { DesignTabPanel } from "../design-tab-panel";
import {
  useDesignComposerSubmit,
  useDesignSession,
} from "../design-session-context";
import styles from "./design-modal.module.css";

function jzInputValue(event: Event): string {
  const host = event.currentTarget as HTMLElement & { value?: string };
  return typeof host.value === "string" ? host.value : "";
}

export function DesignModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const design = useDesignSession();
  const handleSubmit = useDesignComposerSubmit();

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Design"
      footer={
        <form onSubmit={handleSubmit} className={styles.composer}>
          <JzInput
            className={styles.input}
            value={design.input}
            aria-label="Design instruction"
            onInput={(event: Event) => {
              if (design.busy) return;
              design.setInput(jzInputValue(event));
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
            label={design.busy ? "Updating…" : "Update"}
            variant="primary"
            size="small"
            disabled={design.busy || !design.input.trim()}
            showIcon={false}
            onClick={(event: Event) => {
              (event.currentTarget as HTMLElement | null)
                ?.closest("form")
                ?.requestSubmit();
            }}
          />
        </form>
      }
    >
      <DesignTabPanel />
    </Modal>
  );
}
