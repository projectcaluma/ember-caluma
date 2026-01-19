import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { cached } from "tracked-toolbox";

export default class CfFieldInputNumberSeparatorComponent extends Component {
  @service intl;

  get disabled() {
    return this.args.disabled || this.args.field?.question.isCalculated;
  }

  get displayValue() {
    return this.formatValue(this.args.field.value);
  }

  get historicalDisplayValue() {
    return this.formatValue(this.args.field?.answer?.historicalValue);
  }

  formatValue(value) {
    if (isNaN(parseFloat(value))) {
      return "";
    }

    return this.intl.formatNumber(value, {
      maximumFractionDigits: 20,
    });
  }

  @cached
  get thousandSeparator() {
    return this.intl.formatNumber(11111).replace(/\p{Number}/gu, "");
  }

  @cached
  get decimalSeparator() {
    return this.intl.formatNumber(1.1).replace(/\p{Number}/gu, "");
  }

  @action
  input({ target: { value } }) {
    // We need to remove the thousand separator and replace the decimal
    // separator with a dot in order to parse it into a number. Which character
    // those are is determined per locale in the getters above.
    const serialized = parseFloat(
      value
        .replace(new RegExp(`\\${this.thousandSeparator}`, "g"), "")
        .replace(new RegExp(`\\${this.decimalSeparator}`), "."),
    );

    this.args.onSave(isNaN(serialized) ? null : serialized);
  }
}
