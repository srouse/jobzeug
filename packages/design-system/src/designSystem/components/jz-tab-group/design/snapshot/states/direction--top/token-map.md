# jz-tab-group — direction=top

Token map for **this variant state** only. Open sibling folders under **`design/snapshot/states/`** for other combinations. Use **`preview.png`** in this folder for pixels. Hex, pixel, and enum **literals** (when captured) appear only under **By layer** in **`tokenMapPresentation`** tables—not in the token index.

## This variant

- **direction:** `top`

- **State folder:** `snapshot/states/direction--top`
- **Root layer:** `direction=top` (`COMPONENT`)

## By layer

Depth-first; siblings ordered by Figma node id. **Nested `INSTANCE`** layers show **component properties** only (no inner implementation). **Typography token** is the repo-aligned text style path when the layer uses a text style. When **`tokenMapPresentation`** is present on a node, fixed-order **Background → Text color → Border → Effects → Corner radius → Padding → Gap → Size constraints → Layout** tables show **token** vs **literal** columns (`—` when empty).

### direction=top

#### Padding

| Side | Token | Literal |
| --- | --- | --- |
| top | — | `0` |
| right | — | `0` |
| bottom | — | `0` |
| left | — | `0` |

#### Gap

| Axis | Token | Literal |
| --- | --- | --- |
| Main axis | — | `0` |
| Counter axis | — | `0` |
| Grid row | — | `0` |
| Grid column | — | `0` |

#### Layout

| Property | Value |
| --- | --- |
| Mode | HORIZONTAL |
| Primary axis align | MIN |
| Counter axis align | MIN |
| Wrap | NO_WRAP |
| Horizontal sizing | HUG |
| Vertical sizing | HUG |

### direction=top › Slot › jz-tab

_Nested **INSTANCE** — internal layers are not captured. Implement by instantiating the main component and applying **component properties** below (not auto-layout, fills, or spacing from inside the instance)._

- **Main component:** `jz-tab`

| Property | Type | Value |
| --- | --- | --- |
| direction | VARIANT | top |
| interactive | VARIANT | default |
| label | TEXT | label |
| selected | VARIANT | true |

### direction=top › Slot › jz-tab

_Nested **INSTANCE** — internal layers are not captured. Implement by instantiating the main component and applying **component properties** below (not auto-layout, fills, or spacing from inside the instance)._

- **Main component:** `jz-tab`

| Property | Type | Value |
| --- | --- | --- |
| direction | VARIANT | bottom |
| interactive | VARIANT | default |
| label | TEXT | label |
| selected | VARIANT | false |
