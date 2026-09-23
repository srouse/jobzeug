import { LitElement, PropertyValues } from 'lit';
/**
 * Tab group from the jz-tab-group capture. Layout chrome only — compose
 * `jz-tab-item` children (labels, hrefs, values). `selectedTab` matches a
 * child `value`, or its index as a string (`"0"`, `"1"`, …).
 */
export declare class JzTabGroupElement extends LitElement {
    #private;
    static styles: import('lit').CSSResult;
    /**
     * Selected tab key: a child `value`, or index string (`"0"`, `"1"`, …).
     * Figma capture used `"0"` | `"1"` | `"2"`; any string is allowed in product.
     */
    selectedTab: string;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected updated(changed: PropertyValues): void;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "jz-tab-group": JzTabGroupElement;
    }
}
//# sourceMappingURL=jz-tab-group.d.ts.map