import { googleFontsStylesheetHref, isGoogleFontFamily } from "./fonts";

/** DOM id for the Design-tab override stylesheet. */
export const SESSION_TOKENS_STYLE_ID = "jobzeug-session-tokens";

/** DOM id for the optional Google Fonts <link> loaded with the override. */
export const SESSION_FONTS_LINK_ID = "jobzeug-session-fonts";

/** True when the override `<style>` is currently in document.head. */
export function isSessionTokensInjected(): boolean {
  if (typeof document === "undefined") return false;
  return Boolean(document.getElementById(SESSION_TOKENS_STYLE_ID));
}

function syncGoogleFontLink(fontFamily: string | null): void {
  if (typeof document === "undefined") return;
  const existing = document.getElementById(
    SESSION_FONTS_LINK_ID,
  ) as HTMLLinkElement | null;

  if (!fontFamily || !isGoogleFontFamily(fontFamily)) {
    existing?.remove();
    return;
  }

  const href = googleFontsStylesheetHref(fontFamily);
  if (!href) {
    existing?.remove();
    return;
  }

  let link = existing;
  if (!link) {
    link = document.createElement("link");
    link.id = SESSION_FONTS_LINK_ID;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  if (link.href !== href) {
    link.href = href;
  }
}

/**
 * Inject (or replace) the session override sheet.
 * Loads Google Fonts CSS when `fontFamily` is a curated Google face.
 * No-op on the server. Does not run unless called explicitly (Design tab Apply).
 */
export function injectSessionTokens(
  css: string,
  fontFamily?: string | null,
): void {
  if (typeof document === "undefined") return;
  let el = document.getElementById(
    SESSION_TOKENS_STYLE_ID,
  ) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = SESSION_TOKENS_STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = css;
  syncGoogleFontLink(fontFamily ?? null);
}

/**
 * Remove the session override sheet and any session Google Fonts link.
 * Explicit Design-tab Remove only — never auto-called on navigation.
 */
export function removeSessionTokens(): void {
  if (typeof document === "undefined") return;
  document.getElementById(SESSION_TOKENS_STYLE_ID)?.remove();
  document.getElementById(SESSION_FONTS_LINK_ID)?.remove();
}
