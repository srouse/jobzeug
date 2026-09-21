import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-zinc-950 px-8 pb-16 pt-24 text-zinc-50 sm:px-12 sm:pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#3f3f46_0%,_transparent_55%)] opacity-60"
      />
      <div className="relative z-10 max-w-xl">
        <p className="text-5xl font-semibold tracking-tight sm:text-7xl">
          Jobzeug
        </p>
        <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">
          Evidence workspace and agent surface for the Figma Forward Deployed
          Engineer application. Dynamic UI comes next.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/chat"
            className="rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-white"
          >
            Open agent chat
          </Link>
          <Link
            href="/api/logout"
            className="rounded-md border border-zinc-600 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-400"
          >
            Log out
          </Link>
          <span className="self-center text-xs text-zinc-500">
            Studio: npm run dev:studio
          </span>
        </div>
      </div>
    </main>
  );
}
