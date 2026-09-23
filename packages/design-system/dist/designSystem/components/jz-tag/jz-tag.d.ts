import { LitElement } from 'lit';
import { JzIconElement } from '../jz-icon/jz-icon.js';
export type JzTagVariant = "default" | "primary" | "outline";
/**
 * Tag from the jz-tag capture. Style → `variant`. Figma `title` → `label`.
 * Hover / active chrome only when `href` is set (link / interactive tag).
 * Nested `jz-icon` is Size Small with `inheritColor`.
 */
export declare class JzTagElement extends LitElement {
    /** Keeps `jz-icon` in this module’s dependency graph (CE registration). */
    static readonly iconElement: typeof JzIconElement;
    static styles: import('lit').CSSResult;
    variant: JzTagVariant;
    /** Figma `title` — visible text (not the HTML tooltip attribute). */
    label: string;
    /** Figma `show-icon`. */
    showIcon: boolean;
    /** Phosphor name for the nested `jz-icon` (code-only; Figma instance swap). */
    icon: string;
    /**
     * When set, the tag is a link: hover/active chrome applies and content is
     * wrapped in an anchor. Omit for a static (non-interactive) tag.
     */
    href: string;
    willUpdate(): void;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "jz-tag": JzTagElement;
    }
}
//# sourceMappingURL=jz-tag.d.ts.map