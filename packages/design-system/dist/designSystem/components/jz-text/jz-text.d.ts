import { LitElement } from 'lit';
export type JzTextLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type JzTextVariant = "display-large" | "display" | "title" | "heading" | "heading2" | "heading3" | "subtitle" | "body-default" | "body-regular" | "body-strong" | "label" | "label-sm" | "caption" | "overline";
export type JzTextWeight = "200" | "300" | "400" | "500" | "600" | "700";
export type JzTextColor = "default" | "muted" | "primary" | "secondary" | "tertiary" | "inverse" | "error" | "success" | "warning";
/**
 * Token-only typography primitive (no Figma capture). Recipes are
 * `semantic.type`; optional `weight` / `color` override from primitives
 * and semantic text colors. `level` picks the semantic tag; `label` is
 * slot fallback; light-DOM children project through `<slot>`.
 * Opt-in `interactive` / `disabled` use control background + text tokens.
 */
export declare class JzTextElement extends LitElement {
    #private;
    static styles: import('lit').CSSResult;
    variant: JzTextVariant;
    /** Unset keeps the recipe’s stock weight. */
    weight: JzTextWeight | "";
    color: JzTextColor;
    /**
     * Semantic tag: `0` → `span`, `1`–`6` → `h1`–`h6`.
     * Reflected as attribute for CSS / debugging.
     */
    level: JzTextLevel;
    /** Slot fallback when there are no light-DOM children. */
    label: string;
    /** Opt-in control mode: pointer + control-default-hover background. */
    interactive: boolean;
    disabled: boolean;
    /**
     * When set, content is an inline anchor (`<a>`). Level `0` is the
     * anchor; levels `1`–`6` keep the heading and wrap it. Code-only.
     */
    href: string;
    /** Forwarded to the anchor. `_blank` also sets `rel="noopener noreferrer"`. */
    target: string;
    connectedCallback(): void;
    disconnectedCallback(): void;
    willUpdate(): void;
    updated(): void;
    render(): import('lit-html').TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        "jz-text": JzTextElement;
    }
}
//# sourceMappingURL=jz-text.d.ts.map