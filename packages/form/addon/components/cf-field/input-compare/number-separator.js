import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { cached } from "tracked-toolbox";

export default class CfFieldInputNumberSeparatorCompareComponent extends Component {
  @service intl;

  get displayValue() {
    return this.formatValue(this.args.field.answer.value);
  }

  get historicalDisplayValue() {
    return this.formatValue(this.args.field.answer.historicalValue);
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
}
