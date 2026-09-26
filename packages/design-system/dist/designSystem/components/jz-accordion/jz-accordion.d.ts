import { LitElement, PropertyValues } from 'lit';
import { JzAccordionItemElement } from '../jz-accordion-item/jz-accordion-item.js';
/**
 * Accordion from the jz-accordion capture. Layout shell only — compose
 * `jz-accordion-item` children. `openItem` matches a child `value`, or its
 * index as a string (`"0"`, `"1"`, …). At most one item is open.
 */
export declare class JzAccordionElement extends LitElement {
    #private;
    /** Keeps `jz-accordion-item` in this module’s dependency graph. */
    static readonly itemElement: typeof JzAccordionItemElement;
    static styles: import('lit').CSSResult;
    /**
     * Open item key: a child `value`, or index string (`"0"`, `"1"`, …).
     * Empty string means none open. Capture sample opened the first item (`"0"`).
     */
    openItem: string;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected firstUpdated(): void;
    protected updated(changed: PropertyValues): void;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "jz-accordion": JzAccordionElement;
    }
}
//# sourceMappingURL=jz-accordion.d.ts.map