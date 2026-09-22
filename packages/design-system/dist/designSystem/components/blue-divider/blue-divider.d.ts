import { LitElement } from 'lit';
/**
 * Horizontal rule from the blue-divider capture (single default state).
 * No props — fill is `border/default`, height is stroke `sm`.
 */
export declare class JzDividerElement extends LitElement {
    createRenderRoot(): HTMLElement | DocumentFragment;
    connectedCallback(): void;
    render(): symbol;
}
declare global {
    interface HTMLElementTagNameMap {
        "jz-divider": JzDividerElement;
    }
}
//# sourceMappingURL=blue-divider.d.ts.map