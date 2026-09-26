import { LitElement } from 'lit';
export type JzHighlightBreakpoint = "default" | "mobile";
/**
 * Highlight control from the jz-highlight capture.
 * breakpoint → layout; interactive → native hover/active/disabled;
 * isSelected → `selected`. Default body is a 7-col grid (highlight
 * span 4, description span 3). Typography via host type tokens.
 */
export declare class JzHighlightElement extends LitElement {
    static styles: import('lit').CSSResult;
    /** Figma breakpoint: Default | mobile. */
    breakpoint: JzHighlightBreakpoint;
    /** Figma `isSelected`. */
    selected: boolean;
    disabled: boolean;
    /** Figma `title`. Not reflected (avoids HTML tooltip `title`). */
    title: string;
    /** Figma `highlight` (primary value text). */
    highlight: string;
    description: string;
    willUpdate(): void;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "jz-highlight": JzHighlightElement;
    }
}
//# sourceMappingURL=jz-highlight.d.ts.map