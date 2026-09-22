/**
 * React Server Components must not import `@jobzeug/design-system/react`.
 * Lit requires a browser DOM. Use this package only from a Client Component.
 */
throw new Error(
  '@jobzeug/design-system/react is browser-only. Import it from a Client Component ("use client"), not from a React Server Component.',
);
