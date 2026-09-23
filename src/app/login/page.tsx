import { JzText } from "@jobzeug/design-system/react";
import { LoginForm } from "./login-form";
import styles from "./login.module.css";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.next && params.next.startsWith("/") ? params.next : "/";
  const showError = params.error === "1";
  const showConfig = params.error === "config";

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
