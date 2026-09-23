import { LitElement, PropertyValues } from 'lit';
export type JzIconColor = "default" | "inverse" | "primary";
export type JzIconSize = "small" | "medium" | "large";
export type JzIconWeight = "regular" | "fill";
/**
 * Phosphor webfont icon. Color and size map to Figma axes; `icon` is any
 * Phosphor name (PascalCase or kebab). `weight`, `disabled`, `spin`, and
 * `inheritColor` are code-only. Glyph is a shadow span with Phosphor classes
 * (document CSS does not pierce parent shadows when this icon is composed).
 */
export declare class JzIconElement extends LitElement {
    #private;
    static styles: import('lit').CSSResult[];
    color: JzIconColor;
    size: JzIconSize;
    /** Phosphor icon PascalCase or kebab-case (e.g. `Info`, `magnifying-glass`). */
    icon: string;
    /** Phosphor glyph weight (code-only; not on Figma contract). */
    weight: JzIconWeight;
    /** When true, use disabled semantic icon colors (code-only). */
    disabled: boolean;
    /**
     * When true, continuously rotate the Phosphor glyph (`::before` only).
     * Host layout box is unchanged (code-only).
     */
    spin: boolean;
    /**
     * When true, use color: inherit so a parent (button/tag) can drive the
     * glyph from its text color (code-only; composition).
     */
    inheritColor: boolean;
    willUpdate(): void;
    render(): import('lit-html').TemplateResult<1>;
    protected updated(_changedProperties: PropertyValues): void;
    connectedCallback(): void;
    /** Phosphor webfont classes on the shadow glyph (shadow-local CSS). */
    private syncGlyphClasses;
}
declare global {
    interface HTMLElementTagNameMap {
        "jz-icon": JzIconElement;
    }
}
//# sourceMappingURL=jz-icon.d.ts.map