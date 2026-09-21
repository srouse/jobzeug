type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params.next && params.next.startsWith("/") ? params.next : "/";
  const showError = params.error === "1";
  const showConfig = params.error === "config";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-zinc-50">
      <div className="w-full max-w-sm">
        <p className="text-3xl font-semibold tracking-tight">Jobzeug</p>
        <p className="mt-2 text-sm text-zinc-400">
          Enter the site password to continue.
        </p>

        {showConfig ? (
          <p className="mt-6 text-sm text-amber-400" role="alert">
            SITE_PASSWORD and SESSION_SECRET are not configured.
          </p>
        ) : (
          <form
            method="post"
            action="/api/login"
            className="mt-8 flex flex-col gap-3"
          >
            <input type="hidden" name="next" value={next} />
            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-zinc-400"
              placeholder="Password"
            />
            {showError ? (
              <p className="text-sm text-red-400" role="alert">
                Incorrect password.
              </p>
            ) : null}
            <button
              type="submit"
              className="rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-white"
            >
              Continue
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
