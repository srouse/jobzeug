import { LitElement } from 'lit';
export type JzButtonVariant = "primary" | "secondary" | "inverse" | "dark";
export type JzButtonSize = "default" | "small";
/**
 * Button from the blue-button capture. Interaction is native
 * (`:hover`, `:active`, `disabled`). Text is `label` + `showText`.
 * Size drives type (`label` vs `label/sm`), nested icon (AGENTS.md),
 * and Dark+Disabled border.
 */
export declare class JzButtonElement extends LitElement {
    static styles: import('lit').CSSResult;
    variant: JzButtonVariant;
    size: JzButtonSize;
    label: string;
    /** Figma `showtext` — when false, hide the label. */
    showText: boolean;
    /**
     * Figma `showicon`. No host chrome until `blue-icon` is composed
     * (see AGENTS.md).
     */
    showIcon: boolean;
    disabled: boolean;
    willUpdate(): void;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "jz-button": JzButtonElement;
    }
}
//# sourceMappingURL=blue-button.d.ts.map