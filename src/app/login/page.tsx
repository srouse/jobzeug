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
        <p className={styles.brand}>Jobzeug</p>
        <p className={styles.lede}>Enter the site password to continue.</p>

        {showConfig ? (
          <p className={styles.warn} role="alert">
            SITE_PASSWORD and SESSION_SECRET are not configured.
          </p>
        ) : (
          <LoginForm next={next} showError={showError} />
        )}
      </div>
    </main>
  );
}
