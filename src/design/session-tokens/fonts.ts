/**
 * Session font allowlist — local stacks + curated Google Fonts.
 * Human/agent catalog: ./google-fonts.md
 */

export const LOCAL_FONT_FAMILIES = [
  "Geist",
  "system-ui",
  "ui-sans-serif",
  "Georgia",
  "ui-serif",
  "ui-monospace",
  "monospace"
] as const;

export const GOOGLE_FONT_FAMILIES = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Raleway",
  "Nunito",
  "Source Sans 3",
  "Work Sans",
  "DM Sans",
  "Manrope",
  "Plus Jakarta Sans",
  "Outfit",
  "Figtree",
  "Space Grotesk",
  "IBM Plex Sans",
  "Noto Sans",
  "Rubik",
  "Mulish",
  "Libre Franklin",
  "Archivo",
  "Barlow",
  "Cabin",
  "Josefin Sans",
  "Quicksand",
  "Instrument Sans",
  "Sora",
  "Lexend",
  "Urbanist",
  "Syne",
  "Oswald",
  "Bebas Neue",
  "Playfair Display",
  "Merriweather",
  "Lora",
  "Source Serif 4",
  "Libre Baskerville",
  "Crimson Pro",
  "EB Garamond",
  "Cormorant Garamond",
  "Noto Serif",
  "Bitter",
  "Cardo",
  "Spectral",
  "Fraunces",
  "Newsreader",
  "Instrument Serif",
  "Comfortaa",
  "Pacifico",
  "Dancing Script",
  "Caveat",
  "Great Vibes",
  "JetBrains Mono",
  "Fira Code",
  "Source Code Pro",
  "IBM Plex Mono",
  "Space Mono",
  "Roboto Mono",
  "Inconsolata",
  "Anonymous Pro"
] as const;

export const ALLOWED_FONT_FAMILIES = [
  ...LOCAL_FONT_FAMILIES,
  ...GOOGLE_FONT_FAMILIES,
] as const;

export type AllowedFontFamily = (typeof ALLOWED_FONT_FAMILIES)[number];

const GOOGLE_SET = new Set<string>(GOOGLE_FONT_FAMILIES);

export function isGoogleFontFamily(family: string): boolean {
  return GOOGLE_SET.has(family);
}

/** CSS2 stylesheet URL for a Google family (wght 300–800 for UI). */
export function googleFontsStylesheetHref(family: string): string | null {
  if (!isGoogleFontFamily(family)) return null;
  const param = family.replace(/ /g, "+") + ":wght@300;400;500;600;700;800";
  return `https://fonts.googleapis.com/css2?family=${param}&display=swap`;
}
