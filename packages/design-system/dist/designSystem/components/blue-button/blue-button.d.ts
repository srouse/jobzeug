import { LitElement } from 'lit';
import { sizes, variants } from './blue-button.css.js';
export type JzButtonVariant = keyof typeof variants;
export type JzButtonSize = keyof typeof sizes;
/**
 * Button from the blue-button capture. Interaction is native
 * (`:hover`, `:active`, `disabled`). Text is `label` + `showText`.
 * Size drives type (`label` vs `label/sm`), nested icon (AGENTS.md),
 * and Dark+Disabled border.
 */
export declare class JzButtonElement extends LitElement {
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
    createRenderRoot(): HTMLElement | DocumentFragment;
    render(): import('lit').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "jz-button": JzButtonElement;
    }
}
//# sourceMappingURL=blue-button.d.ts.map