import { LitElement, PropertyValues } from 'lit';
import { JzTabElement, JzTabDirection } from '../jz-tab/jz-tab.js';
/**
 * Tab group from the jz-tab-group capture. Horizontal slot row of `jz-tab`
 * children. `direction` mirrors onto children; selection via `selected-tab`.
 */
export declare class JzTabGroupElement extends LitElement {
    #private;
    static readonly deps: (typeof JzTabElement)[];
    static styles: import('lit').CSSResult;
    /** Figma `direction` — applied to slotted `jz-tab` children. */
    direction: JzTabDirection;
    /**
     * Selected tab key: a child `value`, or index string (`"0"`, `"1"`, …).
     * Product API (not a Figma axis on the group).
     */
    selectedTab: string;
    willUpdate(): void;
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