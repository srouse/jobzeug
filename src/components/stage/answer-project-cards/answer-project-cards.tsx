"use client";

import { JzProjectCard } from "@jobzeug/design-system/react";

import type { CitedProjectCard } from "./top-cited-projects";
import styles from "./answer-project-cards.module.css";

export function AnswerProjectCards({
  cards,
  onSelectSection,
}: {
  cards: CitedProjectCard[];
  onSelectSection: (sectionId: string) => void;
}) {
  if (!cards.length) return null;

  return (
    <div className={styles.row} aria-label="Related projects">
      {cards.map((card) => (
        <button
          key={card.projectId}
          type="button"
          className={styles.cardHit}
          onClick={() => onSelectSection(card.sectionId)}
        >
          <JzProjectCard
            className={styles.card}
            supertitle={card.supertitle}
            title={card.name}
            description=""
            callToAction="Hear story"
          />
        </button>
      ))}
    </div>
  );
}
