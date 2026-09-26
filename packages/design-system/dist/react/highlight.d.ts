import { default as React } from 'react';
/**
 * Browser-only React wrapper for `<jz-highlight>`.
 * Lit is imported after mount so Node / Next SSR never evaluates lit-html.
 */
export declare const JzHighlight: React.ForwardRefExoticComponent<Omit<{
    [x: string]: unknown;
}, "ref"> & React.RefAttributes<HTMLElement>>;
//# sourceMappingURL=highlight.d.ts.map