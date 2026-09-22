# blue-button

## Size axis (matrix)

Host padding, gap, and radius are the same for Default and Small (`padding/sm`+`padding/md`, `gap/sm`, `radius/full`).

What Size changes on the host:

1. **Typography** — Default → `semantic type/label` (`--jz-semantic-type-label-font`); Small → `semantic type/label/sm` (`--jz-semantic-type-label-sm-font`, 12px SemiBold / 20).
2. **Dark + Disabled only** — Default keeps `border/default` at stroke `md`; Small has **no** border (compound selectors on `sizes.default` / `sizes.small`).

Nested (pending `blue-icon`):

- Default → icon Size `Medium`; Small → icon Size `Small`. Wire `size` through when that slug exists.

`showicon` / nested `icon-*` props stay pending composition of `blue-icon`.
