import { LitElement } from 'lit';
import { JzIconElement } from '../jz-icon/jz-icon.js';
export type JzButtonVariant = "primary" | "inverse" | "dark";
export type JzButtonSize = "default" | "small";
/**
 * Button from the jz-button capture. Interaction is native
 * (`:hover`, `:active`, `disabled`). Text is `label` + `showText`.
 * Size drives type (`label` vs `label/sm`) and nested icon size.
 * Style axis is Primary | Inverse | Dark (Secondary removed).
 * No host border — capture has no `border/*` paint.
 * `loading` is code-only (not in Figma).
 */
export declare class JzButtonElement extends LitElement {
    /** Keeps `jz-icon` in this module’s dependency graph (CE registration). */
    static readonly iconElement: typeof JzIconElement;
    static styles: import('lit').CSSResult;
    variant: JzButtonVariant;
    size: JzButtonSize;
    label: string;
    /** Figma `showtext` — when false, hide the label. */
    showText: boolean;
    /** Figma `showicon`. */
    showIcon: boolean;
    /** Phosphor name for nested `jz-icon` (Figma `icon-icon` instance swap). */
    icon: string;
    disabled: boolean;
    /**
     * Code-only — not in Figma. When true, shows a trailing Phosphor Spinner
     * (`jz-icon` with `spin`) to the right of the label.
     */
    loading: boolean;
    willUpdate(): void;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "jz-button": JzButtonElement;
    }
}
//# sourceMappingURL=jz-button.d.ts.map