"use client";

import { JzButton, JzText } from "@jobzeug/design-system/react";

import styles from "./contentful.module.css";

const ERRORS: Record<string, string> = {
  config:
    "CONTENTFUL_OAUTH_CLIENT_ID, CONTENTFUL_OAUTH_CLIENT_SECRET, and CONTENTFUL_OAUTH_REDIRECT_URI are not configured.",
  state: "The login attempt expired. Try again.",
  denied: "Contentful did not grant access.",
  token: "Contentful did not return a token.",
  probe: "Could not check space access. Try again.",
};

export function ContentfulPageClient({
  configured,
  status,
  name,
  spaceId,
  environmentId,
  error,
}: {
  configured: boolean;
  status: "anonymous" | "no-access" | "editor";
  name?: string;
  spaceId?: string;
  environmentId?: string;
  error?: string;
}) {
  const errorLabel = !configured
    ? ERRORS.config
    : error
      ? ERRORS[error] ?? "Contentful login failed. Try again."
      : null;

  let body = "Sign in with Contentful to edit presentations in this space.";
  if (status === "editor" && name && spaceId && environmentId) {
    body = `${name} can edit ${spaceId} / ${environmentId}.`;
  } else if (status === "no-access" && name) {
    body = `${name} is signed in. This space and environment are not available to that account.`;
  }

  return (
    <main className={styles.root}>
      <div className={styles.card}>
        <JzText variant="display" color="inverse" label="Contentful" className={styles.brand} />
        <JzText variant="label" color="muted" label={body} className={styles.lede} />
        {errorLabel ? (
          <JzText
            variant="label"
            color="warning"
            label={errorLabel}
            role="alert"
            className={styles.warn}
          />
        ) : null}
        {configured && status === "anonymous" ? (
          <JzText
            variant="body-default"
            color="inverse"
            href="/api/contentful/oauth/start"
            label="Sign in with Contentful"
            className={styles.link}
          />
        ) : null}
        {status !== "anonymous" ? (
          <form method="post" action="/api/contentful/logout" className={styles.form}>
            <JzButton
              variant="inverse"
              label="Sign out"
              showIcon={false}
              onClick={(event: Event) => {
                (event.currentTarget as HTMLElement | null)?.closest("form")?.requestSubmit();
              }}
            />
          </form>
        ) : null}
      </div>
    </main>
  );
}
