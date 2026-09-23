import { default as React } from 'react';
/**
 * Browser-only React wrapper for `<jz-text>`.
 * Lit is imported after mount so Node / Next SSR never evaluates lit-html.
 * Prefer `label` for plain strings; children project through the shadow slot.
 * Use `level` for heading tags (`0` = span, `1`–`6` = h1–h6).
 */
export declare const JzText: React.ForwardRefExoticComponent<Omit<{
    [x: string]: unknown;
}, "ref"> & React.RefAttributes<HTMLElement>>;
//# sourceMappingURL=text.d.ts.map