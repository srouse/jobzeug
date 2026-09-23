"use client";

import { JzText } from "@jobzeug/design-system/react";
import { LoginForm } from "./login-form";
import styles from "./login.module.css";

export function LoginPageClient({
  next,
  showError,
  showConfig,
}: {
  next: string;
  showError: boolean;
  showConfig: boolean;
}) {
  return (
    <main className={styles.root}>
      <div className={styles.card}>
        <JzText
          variant="display"
          color="inverse"
          label="Jobzeug"
          className={styles.brand}
        />
        <JzText
          variant="label"
          color="muted"
          label="Enter the site password to continue."
          className={styles.lede}
        />

        {showConfig ? (
          <JzText
            variant="label"
            color="warning"
            label="SITE_PASSWORD and SESSION_SECRET are not configured."
            role="alert"
            className={styles.warn}
          />
        ) : (
          <LoginForm next={next} showError={showError} />
        )}
      </div>
    </main>
  );
}
