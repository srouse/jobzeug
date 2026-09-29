import type { Metadata } from "next";

import { LoginPageClient } from "./login-page-client";

export const metadata: Metadata = {
  title: "Log in",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.next && params.next.startsWith("/") ? params.next : "/";
  const showError = params.error === "1";
  const showConfig = params.error === "config";

  return (
    <LoginPageClient next={next} showError={showError} showConfig={showConfig} />
  );
}
