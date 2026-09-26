import {
  createElement,
  forwardRef,
  useEffect,
  useState,
  type ComponentType,
  type Ref,
} from "react";

type AnyProps = Record<string, unknown>;

/**
 * `@lit/react` types `createComponent({ react })` as `typeof React` from
 * *its* resolved `@types/react`. Workspaces often have a second physical copy
 * (hoisted vs package `.pnpm`), so the same runtime module fails assignability.
 * Cast once here; runtime is unchanged.
 */
export function litReactModule(react: typeof import("react")): never {
  return react as never;
}

/**
 * Defers importing Lit / `@lit/react` until the client mounts.
 * Lit touches `document` at module load, so a static import of the element
 * crashes Next.js (and any Node SSR) even inside a Client Component.
 */
export function createLazyLitComponent(
  load: () => Promise<ComponentType<AnyProps>>,
  displayName: string,
) {
  let cached: ComponentType<AnyProps> | null = null;
  let pending: Promise<ComponentType<AnyProps>> | null = null;

  const Lazy = forwardRef(function LazyLitComponent(
    props: AnyProps,
    ref: Ref<HTMLElement>,
  ) {
    const [Comp, setComp] = useState<ComponentType<AnyProps> | null>(
      () => cached,
    );

    useEffect(() => {
      if (cached) {
        setComp(() => cached);
        return;
      }
      pending ??= load().then((C) => {
        cached = C;
        return C;
      });
      let cancelled = false;
      pending.then((C) => {
        if (!cancelled) setComp(() => C);
      });
      return () => {
        cancelled = true;
      };
    }, []);

    if (!Comp) return null;
    return createElement(Comp, { ...props, ref });
  });

  Lazy.displayName = displayName;
  return Lazy;
}
