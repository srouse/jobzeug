import { default as React } from 'react';
/**
 * Browser-only React wrapper for `<jz-button>`.
 * Lit is imported after mount so Node / Next SSR never evaluates lit-html.
 */
export declare const JzButton: React.ForwardRefExoticComponent<Omit<{
    [x: string]: unknown;
}, "ref"> & React.RefAttributes<HTMLElement>>;
//# sourceMappingURL=button.d.ts.map