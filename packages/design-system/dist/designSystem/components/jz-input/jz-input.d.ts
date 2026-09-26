import { LitElement } from 'lit';
/**
 * Text input from the jz-input capture (single default state).
 * Figma TEXT `value` → `value` property on a native input.
 */
export declare class JzInputElement extends LitElement {
    #private;
    static styles: import('lit').CSSResult;
    /** Figma `value`. */
    value: string;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "jz-input": JzInputElement;
    }
}
//# sourceMappingURL=jz-input.d.ts.map