import { LitElement } from 'lit';
import { JzIconElement } from '../jz-icon/jz-icon.js';
/**
 * Project card from the jz-project-card capture (single default state).
 * Text props map 1:1 from Figma TEXT properties. Nested ArrowRight → jz-icon.
 */
export declare class JzProjectCardElement extends LitElement {
    /** Keeps `jz-icon` in this module’s dependency graph (CE registration). */
    static readonly deps: (typeof JzIconElement)[];
    static styles: import('lit').CSSResult;
    /** Figma `supertitle`. */
    supertitle: string;
    /** Figma `title`. Not reflected (avoids HTML tooltip `title`). */
    title: string;
    /** Figma `description`. */
    description: string;
    /** Figma `call to action`. */
    callToAction: string;
    render(): import('lit-html').TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        "jz-project-card": JzProjectCardElement;
    }
}
//# sourceMappingURL=jz-project-card.d.ts.map