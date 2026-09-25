"use client";

import { JzButton } from "@jobzeug/design-system/react";

import { Modal } from "@/components/modal";
import { DesignTabPanel } from "../design-tab-panel";
import {
  useDesignComposerSubmit,
  useDesignSession,
} from "../design-session-context";
import styles from "./design-modal.module.css";

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
          <input
            className={styles.input}
            value={design.input}
            onChange={(e) => design.setInput(e.target.value)}
            placeholder="e.g. Colder grays, violet primary, slightly tighter type…"
            disabled={design.busy}
            aria-label="Design instruction"
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
