import { LitElement, css, html, type PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  JzTabElement,
  type JzTabDirection,
} from "../jz-tab/jz-tab.js";

const DIRECTIONS: readonly JzTabDirection[] = ["bottom", "top"];
const DEFAULT_DIRECTION: JzTabDirection = "bottom";

/**
 * Tab group from the jz-tab-group capture. Horizontal slot row of `jz-tab`
 * children. `direction` mirrors onto children; selection via `selected-tab`.
 */
@customElement("jz-tab-group")
export class JzTabGroupElement extends LitElement {
  static readonly deps = [JzTabElement];

  static override styles = css`
    :host {
      box-sizing: border-box;
      display: block;
      width: 100%;
    }

    .tabs {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      margin: 0;
      padding: 0;
      gap: 0;
      border: none;
      background: transparent;
    }

    ::slotted(jz-tab) {
      flex: 0 0 auto;
    }
  `;

  /** Figma `direction` — applied to slotted `jz-tab` children. */
  @property({ type: String, reflect: true })
  direction: JzTabDirection = DEFAULT_DIRECTION;

  /**
   * Selected tab key: a child `value`, or index string (`"0"`, `"1"`, …).
   * Product API (not a Figma axis on the group).
   */
  @property({ type: String, attribute: "selected-tab", reflect: true })
  selectedTab = "0";

  #onClick = (event: Event) => {
    const path = event.composedPath();
    const tab = path.find(
      (node): node is JzTabElement => node instanceof JzTabElement,
    );
    if (!tab || tab.parentElement !== this || tab.disabled) return;

    const tabs = this.#tabs();
    const index = tabs.indexOf(tab);
    if (index < 0) return;

    const key = tab.value || String(index);
    if (this.selectedTab === key) return;
    this.selectedTab = key;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { selectedTab: key, index },
        bubbles: true,
        composed: true,
      }),
    );
  };

  override willUpdate(): void {
    if (!DIRECTIONS.includes(this.direction)) {
      this.direction = DEFAULT_DIRECTION;
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "tablist");
    }
    this.addEventListener("click", this.#onClick);
  }

  override disconnectedCallback() {
    this.removeEventListener("click", this.#onClick);
    super.disconnectedCallback();
  }

  protected override updated(changed: PropertyValues) {
    if (changed.has("selectedTab") || changed.has("direction")) {
      this.#syncChildren();
    }
  }

  #tabs(): JzTabElement[] {
    return [...this.querySelectorAll<JzTabElement>(":scope > jz-tab")];
  }

  #syncChildren() {
    const tabs = this.#tabs();
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i]!;
      tab.direction = this.direction;
      const key = tab.value || String(i);
      tab.selected = key === this.selectedTab;
    }
  }

  #onSlotChange = () => {
    this.#syncChildren();
  };

  override render() {
    return html`
      <div class="tabs" role="presentation">
        <slot @slotchange=${this.#onSlotChange}></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "jz-tab-group": JzTabGroupElement;
  }
}
