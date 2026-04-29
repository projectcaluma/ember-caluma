import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { cached } from "tracked-toolbox";

export default class CfFieldInputNumberSeparatorComponent extends Component {
  @service intl;
  @service notification;

  blockCount = 0;
  blockNotified = false;

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
  get thousandSeparator() {
    return this.intl.formatNumber(11111).replace(/\p{Number}/gu, "");
  }

  @cached
  get decimalSeparator() {
    return this.intl.formatNumber(1.1).replace(/\p{Number}/gu, "");
  }

  @cached
  get questionType() {
    return this.args.field?.question?.raw?.__typename;
  }

  @cached
  get allowedRegex() {
    const mil = RegExp.escape(this.thousandSeparator);
    const dec = RegExp.escape(this.decimalSeparator);

    if (this.questionType === "IntegerQuestion") {
      return new RegExp(`(\\d|${mil})`);
    }
    return new RegExp(`(\\d|${mil}|${dec})`);
  }

  @action
  checkInput(event) {
    // allow keys like backspace, tab and arrows
    if (event.key.length > 1 || event.ctrlKey || event.metaKey) {
      return;
    }

    if (!this.allowedRegex.test(event.key)) {
      event.preventDefault();
      this.blockCount += 1;
    }

    if (this.blockCount > 5 && !this.blockNotified) {
      this.questionType === "IntegerQuestion"
        ? this.notification.warning(
            this.intl.t(`caluma.form.validation.blockNotification`, {
              allowedChars: `0-9 ${this.thousandSeparator}`,
            }),
          )
        : this.notification.warning(
            this.intl.t(`caluma.form.validation.blockNotification`, {
              allowedChars: `0-9 ${this.thousandSeparator} ${this.decimalSeparator}`,
            }),
          );

      this.blockCount = 0;
      this.blockNotified = true;
    }
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
