import { action } from "@ember/object";
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
  @action
  registerComponent() {
    this.args.field._components.add(this);
  }

  @action
  unregisterComponent() {
    this.args.field._components.delete(this);
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
      "form"
    );
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
   * @param {Boolean} bypassTimeout Whether to bypass the timeout
   */
  @restartableTask
  *save(value, bypassTimeout = false) {
    if (typeof this.args.onSave === "function") {
      return yield this.args.onSave(this.args.field, value);
    }

    /* istanbul ignore next */
    if (macroCondition(isTesting())) {
      // no timeout
    } else {
      if (!bypassTimeout) {
        yield timeout(500);
      }
    }

    if (this.args.field.answer) {
      this.args.field.answer.value = value;
    }

    yield this.args.field.validate.perform();

    return yield this.args.field.save.unlinked().perform();
  }
}
