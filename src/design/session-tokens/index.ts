/**
 * Session design-token override — Design tab experiment.
 * Isolated from resume chat / highlights. Apply only via Design tab UI.
 */

export {
  DEFAULT_SESSION_TOKEN_KNOBS,
  type SessionTokenKnobs,
} from "./knobs";
export { buildSessionTokensCss } from "./build-css";
export {
  SESSION_FONTS_LINK_ID,
  SESSION_TOKENS_STYLE_ID,
  injectSessionTokens,
  isSessionTokensInjected,
  removeSessionTokens,
} from "./dom";
export {
  ALLOWED_FONT_FAMILIES,
  GOOGLE_FONT_FAMILIES,
  LOCAL_FONT_FAMILIES,
  googleFontsStylesheetHref,
  isGoogleFontFamily,
  type AllowedFontFamily,
} from "./fonts";
export {
  coerceMidToneHex,
  designTokensAgentKnobsSchema,
  designTokensAgentOutputSchema,
  mergeAndParseKnobs,
  parseSessionTokenKnobs,
  relativeLuminance,
  sessionTokenKnobsSchema,
  type DesignTokensAgentOutput,
  type SessionTokenKnobsParsed,
} from "./schema";
export {
  scrapeBrandSnapshot,
  type BrandSnapshot,
} from "./scrape-branding";
export {
  extractBrandSearchQuery,
  extractUrlFromMessage,
  isBrandMimicIntent,
  pickOfficialHomepage,
  resolveBrandSiteFromMessage,
  type ResolvedBrandSite,
} from "./resolve-brand-site";
