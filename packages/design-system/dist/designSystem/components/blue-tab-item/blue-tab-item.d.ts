import { LitElement } from 'lit';
/**
 * Tab item from the blue-tab-item capture. Figma `State` (default | Selected)
 * maps to the `selected` boolean — not an `interactive` axis.
 * Text is `label`. Optional `href` renders a link instead of a button.
 */
export declare class JzTabItemElement extends LitElement {
    static styles: import('lit').CSSResult;
    label: string;
    /**
     * When set, the tab is an `<a>` for navigation. When empty, it is a
     * `<button>` (in-page selection only).
     */
    href: string;
    /** Selection key for `jz-tab-group` `selected-tab`. Falls back to index. */
    value: string;
    /** Figma State=Selected. */
    selected: boolean;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "jz-tab-item": JzTabItemElement;
    }
}
//# sourceMappingURL=blue-tab-item.d.ts.map