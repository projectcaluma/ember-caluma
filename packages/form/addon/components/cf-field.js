import { action } from "@ember/object";
import { service } from "@ember/service";
import { macroCondition, isTesting } from "@embroider/macros";
import Component from "@glimmer/component";
import { timeout, restartableTask } from "ember-concurrency";

import { hasQuestionType } from "@projectcaluma/ember-core/helpers/has-question-type";

/**
 * Component to display a label and input for a certain field of a document.
 *
 * ```hbs
 * <CfField @field={{this.someField}} />
 * ```
 *
 * You can disable the field by passing `disabled=true`.
 *
 * @class CfFieldComponent
 * @argument {Field} field The field data model to render
 */
export default class CfFieldComponent extends Component {
  @service intl;

  @action
  registerComponent() {
    this.args.field._components.add(this);
  }

  @action
  unregisterComponent() {
    this.args.field._components.delete(this);
  }

  get hasHiddenWidget() {
    return (
      this.args.field?.question.raw.meta.widgetOverride ===
      "cf-field/input/hidden"
    );
  }

  get visible() {
    return (
      !this.args.field?.hidden &&
      !hasQuestionType(this.args.field?.question, "form")
    );
  }

  get labelVisible() {
    return (
      !this.args.field?.question.raw.meta.hideLabel &&
      !hasQuestionType(this.args.field?.question, "static", "action-button")
    );
  }

  get infoTextVisible() {
    return !hasQuestionType(this.args.field?.question, "action-button");
  }

  get hintTextVisible() {
    return !hasQuestionType(
      this.args.field?.question,
      "action-button",
      "static",
      "form",
    );
  }

  get errorIntroText() {
    const _errors = this.save.last.error.errors ?? [];
    if (_errors.some((e) => e?.code === "network_error")) {
      return this.intl.t("caluma.form.error.offline");
    }
    if (_errors.some((e) => e?.message.includes("code='invalid'"))) {
      return this.intl.t("caluma.form.error.invalid");
    }
    return this.intl.t("caluma.form.error.technical-error");
  }

  get saveIndicatorVisible() {
    return !hasQuestionType(this.args.field?.question, "action-button");
  }

  /**
   * Task to save a field. This will set the passed value to the answer and save
   * the field to the API after a timeout of 500 milliseconds which intends to
   * reduce the amount of saved values when changed rapidly.
   *
   * @method save
   * @param {String|Number|String[]} value The new value to save to the field
   */
  @restartableTask
  *save(value) {
    if (typeof this.args.onSave === "function") {
      return yield this.args.onSave(this.args.field, value);
    }

    /* istanbul ignore next */
    if (macroCondition(!isTesting())) {
      yield timeout(500);
    }

    if (this.args.field.answer) {
      this.args.field.answer.value = value;
    }

    yield this.args.field.validate.perform();

    return yield this.args.field.save.unlinked().perform();
  }

  @action
  refreshDynamicOptions() {
    if (
      this.args.field.question.isDynamic &&
      this.args.field.question.dynamicOptions.isResolved
    ) {
      this.args.field.question.dynamicOptions.retry();
    }
  }
}
