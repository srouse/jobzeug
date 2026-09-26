import { LitElement } from 'lit';
import { JzIconElement } from '../jz-icon/jz-icon.js';
export type JzIconButtonSize = "medium" | "small";
/**
 * Icon-only button from the jz-icon-button capture. Size → nested
 * `jz-icon` size (Medium / Small). Interactive → native hover / active /
 * disabled. Host chrome: padding/sm + radius/sm (same both sizes).
 */
export declare class JzIconButtonElement extends LitElement {
    /** Keeps `jz-icon` in this module’s dependency graph (CE registration). */
    static readonly iconElement: typeof JzIconElement;
    static styles: import('lit').CSSResult;
    /** Figma Size: Small (default) | Medium — drives nested icon size only. */
    size: JzIconButtonSize;
    /** Phosphor name for nested `jz-icon` (Figma instance swap). */
    icon: string;
    /** Accessible name (no visible text in the capture). */
    label: string;
    disabled: boolean;
    willUpdate(): void;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "jz-icon-button": JzIconButtonElement;
    }
}
//# sourceMappingURL=jz-icon-button.d.ts.map