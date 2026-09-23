"use client";

import { JzButton, JzText } from "@jobzeug/design-system/react";
import styles from "./login.module.css";

export function LoginForm({
  next,
  showError,
}: {
  next: string;
  showError: boolean;
}) {
  return (
    <form method="post" action="/api/login" className={styles.form}>
      <input type="hidden" name="next" value={next} />
      <label className="srOnly" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
        className={styles.input}
        placeholder="Password"
      />
      {showError ? (
        <JzText
          variant="label"
          color="error"
          label="Incorrect password."
          role="alert"
          className={styles.error}
        />
      ) : null}
      <JzButton
        variant="inverse"
        label="Continue"
        showIcon={false}
        onClick={(event: Event) => {
          (event.currentTarget as HTMLElement | null)
            ?.closest("form")
            ?.requestSubmit();
        }}
      />
    </form>
  );
}
