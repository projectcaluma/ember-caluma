import { action } from "@ember/object";
import { scheduleOnce } from "@ember/runloop";
import { inject as service } from "@ember/service";
import { htmlSafe } from "@ember/template";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class CfbSlugInputComponent extends Component {
  @service calumaOptions;
  @service intl;

  @tracked padding = null;

  get prefix() {
    const prefix = this.args.prefix ?? this.calumaOptions.namespace ?? null;

    return prefix ? `${prefix}-` : "";
  }

  get inputStyle() {
    return htmlSafe(this.padding ? `padding-left: ${this.padding};` : "");
  }

  get displayValue() {
    if (this.args.disabled && !this.args.hidePrefix) {
      return this.args.value;
    }

    return this.args.value?.replace(new RegExp(`^${this.prefix}`), "") ?? "";
  }

  @action
  calculatePadding(element) {
    // Ensures that the element is already visible in combined use
    // with modal dialogs.
    scheduleOnce("afterRender", this, "_calculatePadding", element);
  }

  _calculatePadding(element) {
    const prefixWidth = element.clientWidth;
    const prefixMargin = window.getComputedStyle(element).marginLeft;

    this.padding = `calc(${prefixWidth}px + ${prefixMargin})`;
  }

  @action
  update({ target: { value } }) {
    this.args.update(value ? this.prefix + value : "");
    this.args.setDirty();
    this.args.onUnlink?.();
  }
}
