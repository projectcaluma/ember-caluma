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
    return this.formatValue(this.args.field.answer?.historicalValue);
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
  get numberParts() {
    // Breaks the dummy number into an array of its exact pieces based on the user's active language
    return new Intl.NumberFormat(this.intl.locales).formatToParts(11111.1);
  }

  @cached
  get thousandSeparator() {
    // Search the array for the piece labeled 'group' (which represents the thousands separator)
    const part = this.numberParts.find((p) => p.type === "group");
    return part ? part.value : "";
  }

  @cached
  get decimalSeparator() {
    // Search the array for the piece labeled 'decimal'.
    // If it exists, return its character. If not, default to a standard dot.
    const part = this.numberParts.find((p) => p.type === "decimal");
    return part ? part.value : ".";
  }

  @action
  input({ target: { value } }) {
    // We need to remove the thousand separator and replace the decimal
    // separator with a dot in order to parse it into a number. Which character
    // those are is determined per locale in the getters above.

    let cleaned = value;

    if (this.thousandSeparator) {
      // Remove all space variants, ensuring both user-typed regular spaces and the Intl non-breaking spaces.
      if (/\s/.test(this.thousandSeparator)) {
        cleaned = cleaned.replace(/\s/g, "");
      } else {
        cleaned = cleaned.split(this.thousandSeparator).join("");
      }
    }

    cleaned = cleaned.replace(this.decimalSeparator, ".");
    const serialized = parseFloat(cleaned);

    this.args.onSave(isNaN(serialized) ? null : serialized);
  }
}
