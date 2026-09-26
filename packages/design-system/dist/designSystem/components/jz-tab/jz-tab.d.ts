import { LitElement } from 'lit';
export type JzTabDirection = "bottom" | "top";
/**
 * Tab from the jz-tab capture. Interactive → native :hover/:active/disabled;
 * selected → indicator bar; direction → bar top or bottom.
 */
export declare class JzTabElement extends LitElement {
    static styles: import('lit').CSSResult;
    /** Figma `direction`: bottom | top — selected-bar edge. */
    direction: JzTabDirection;
    /** Figma `selected`. */
    selected: boolean;
    disabled: boolean;
    /** Figma `label`. */
    label: string;
    /**
     * Selection key for `jz-tab-group` (code-only; not on Figma contract).
     * Falls back to child index when empty.
     */
    value: string;
    willUpdate(): void;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "jz-tab": JzTabElement;
    }
}
//# sourceMappingURL=jz-tab.d.ts.map