import { ComponentType } from 'react';
type AnyProps = Record<string, unknown>;
/**
 * Defers importing Lit / `@lit/react` until the client mounts.
 * Lit touches `document` at module load, so a static import of the element
 * crashes Next.js (and any Node SSR) even inside a Client Component.
 */
export declare function createLazyLitComponent(load: () => Promise<ComponentType<AnyProps>>, displayName: string): import('react').ForwardRefExoticComponent<Omit<AnyProps, "ref"> & import('react').RefAttributes<HTMLElement>>;
export {};
//# sourceMappingURL=lazy-lit.d.ts.map