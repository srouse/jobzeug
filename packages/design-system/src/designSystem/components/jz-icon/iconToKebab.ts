/** PascalCase or kebab-case icon id → kebab suffix for **`ph-{name}`** (no **`ph-`** prefix). */
export function iconToKebab(icon: string): string {
  if (icon.includes("-")) {
    return icon.toLowerCase();
  }

  return icon
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}
