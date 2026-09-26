import { default as React } from 'react';
/**
 * Browser-only React wrapper for `<jz-input>`.
 * Lit is imported after mount so Node / Next SSR never evaluates lit-html.
 */
export declare const JzInput: React.ForwardRefExoticComponent<Omit<{
    [x: string]: unknown;
}, "ref"> & React.RefAttributes<HTMLElement>>;
//# sourceMappingURL=input.d.ts.map