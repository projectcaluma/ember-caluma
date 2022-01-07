import { getOwner } from "@ember/application";
import { set } from "@ember/object";
import Component from "@glimmer/component";
import { timeout, restartableTask } from "ember-concurrency";

import { hasQuestionType } from "@projectcaluma/ember-core/helpers/has-question-type";

/**
 * Component to display a label and input for a certain field of a document.
 *
 * ```hbs
 * {{cf-field field=someField}}
 * ```
 *
 * You can disable the field by passing `disabled=true`.
 *
 * @class CfFieldComponent
 * @argument {Field} field The field data model to render
 */
export default class CfFieldComponent extends Component {
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

  get saveIndicatorVisible() {
    return !hasQuestionType(this.args.field?.question, "action-button");
  }

  /**
   * Task to save a field. This will set the passed value to the answer and
   * save the field to the API after a timeout off 500 milliseconds.
   *
   * @method save
   * @param {String|Number|String[]} value
   */
  @restartableTask
  *save(value) {
    const { environment } =
      getOwner(this).resolveRegistration("config:environment");

    /* istanbul ignore next */
    if (environment !== "test") {
      yield timeout(500);
    }

    set(this.args.field.answer, "value", value);

    yield this.args.field.validate.perform();

    try {
      return yield this.args.field.save.unlinked().perform();
    } catch (e) {
      // that's ok
    }
  }
}
