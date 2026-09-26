import { LitElement } from 'lit';
import { JzIconElement } from '../jz-icon/jz-icon.js';
/**
 * Accordion item from the jz-accordion-item capture. Interactive → native
 * hover / active / disabled (title color only). Expanded panel gated by
 * `show-content`. Nested chevron is composed `jz-icon`.
 */
export declare class JzAccordionItemElement extends LitElement {
    #private;
    /** Keeps `jz-icon` in this module’s dependency graph (CE registration). */
    static readonly iconElement: typeof JzIconElement;
    static styles: import('lit').CSSResult;
    /** Figma `Title`. Not reflected (avoids HTML tooltip `title`). */
    title: string;
    description: string;
    subtitle: string;
    /** Figma `Show Content` — reveals the Expanded panel. */
    showContent: boolean;
    /** Figma `Show Subtitle`. */
    showSubtitle: boolean;
    /** Figma `Show slot`. */
    showSlot: boolean;
    /**
     * Selection key for `jz-accordion` `open-item`. Falls back to index.
     * Code-only (not in the item capture).
     */
    value: string;
    disabled: boolean;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "jz-accordion-item": JzAccordionItemElement;
    }
}
//# sourceMappingURL=jz-accordion-item.d.ts.map