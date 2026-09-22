import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.root}>
      <div aria-hidden className={styles.glow} />
      <div className={styles.content}>
        <p className={styles.brand}>Jobzeug</p>
        <p className={styles.lede}>
          Evidence workspace and agent surface for the Figma Forward Deployed
          Engineer application. Dynamic UI comes next.
        </p>
        <div className={styles.actions}>
          <Link href="/resume" className={styles.primary}>
            Open resume
          </Link>
          <Link href="/chat" className={styles.secondary}>
            Open agent chat
          </Link>
          <Link href="/api/logout" className={styles.secondary}>
            Log out
          </Link>
          <span className={styles.hint}>Studio: npm run dev:studio</span>
        </div>
      </div>
    </main>
  );
}
