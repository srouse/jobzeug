# jz-accordion — (default)

Token map for **this variant state** only. Open sibling folders under **`design/snapshot/states/`** for other combinations. Use **`preview.png`** in this folder for pixels. Hex, pixel, and enum **literals** (when captured) appear only under **By layer** in **`tokenMapPresentation`** tables—not in the token index.

## This variant

_No variant axes on this component (single default state)._

- **State folder:** `snapshot/states/node_39_526`
- **Root layer:** `jz-accordion` (`COMPONENT`)

## By layer

Depth-first; siblings ordered by Figma node id. **Nested `INSTANCE`** layers show **component properties** only (no inner implementation). **Typography token** is the repo-aligned text style path when the layer uses a text style. When **`tokenMapPresentation`** is present on a node, fixed-order **Background → Text color → Border → Effects → Corner radius → Padding → Gap → Size constraints → Layout** tables show **token** vs **literal** columns (`—` when empty).

### jz-accordion

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
| Mode | VERTICAL |
| Primary axis align | MIN |
| Counter axis align | MIN |
| Wrap | NO_WRAP |
| Horizontal sizing | FIXED |
| Vertical sizing | HUG |

### jz-accordion › Slot

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
| Mode | VERTICAL |
| Primary axis align | MIN |
| Counter axis align | MIN |
| Wrap | NO_WRAP |
| Horizontal sizing | FILL |
| Vertical sizing | HUG |

### jz-accordion › Slot › jz-accordion-item

_Nested **INSTANCE** — internal layers are not captured. Implement by instantiating the main component and applying **component properties** below (not auto-layout, fills, or spacing from inside the instance)._

- **Main component:** `jz-accordion-item`

| Property | Type | Value |
| --- | --- | --- |
| Description | TEXT | Description |
| Show Content | BOOLEAN | true |
| Show Subtitle | BOOLEAN | true |
| Show slot | BOOLEAN | true |
| Slot | SLOT | undefined |
| Subtitle | TEXT | Subtitle |
| Title | TEXT | Accordion title |
| interactive | VARIANT | Default |

### jz-accordion › Slot › jz-accordion-item

_Nested **INSTANCE** — internal layers are not captured. Implement by instantiating the main component and applying **component properties** below (not auto-layout, fills, or spacing from inside the instance)._

- **Main component:** `jz-accordion-item`

| Property | Type | Value |
| --- | --- | --- |
| Description | TEXT | Description |
| Show Content | BOOLEAN | false |
| Show Subtitle | BOOLEAN | true |
| Show slot | BOOLEAN | true |
| Slot | SLOT | undefined |
| Subtitle | TEXT | Subtitle |
| Title | TEXT | Accordion title |
| interactive | VARIANT | Default |

### jz-accordion › Slot › jz-accordion-item

_Nested **INSTANCE** — internal layers are not captured. Implement by instantiating the main component and applying **component properties** below (not auto-layout, fills, or spacing from inside the instance)._

- **Main component:** `jz-accordion-item`

| Property | Type | Value |
| --- | --- | --- |
| Description | TEXT | Description |
| Show Content | BOOLEAN | false |
| Show Subtitle | BOOLEAN | true |
| Show slot | BOOLEAN | true |
| Slot | SLOT | undefined |
| Subtitle | TEXT | Subtitle |
| Title | TEXT | Accordion title |
| interactive | VARIANT | Default |
