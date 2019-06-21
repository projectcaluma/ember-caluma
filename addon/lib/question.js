import Base from "ember-caluma/lib/base";
import { computed } from "@ember/object";
import { next } from "@ember/runloop";
import { lastValue } from "ember-caluma/utils/concurrency";
import { getAST, getTransforms } from "ember-caluma/utils/jexl";
import { task } from "ember-concurrency";
import { assert } from "@ember/debug";

/**
 * Object which represents a question in context of a field
 *
 * @class Question
 */
export default Base.extend({
  init() {
    this._super(...arguments);

    assert("A graphql question `raw` must be passed", this.raw);

    this.setProperties(this.raw);
  },

  /**
   * Question slugs that are used in the `isHidden` JEXL expression
   *
   * If the value or visibility of any of these fields is changed, the
   * JEXL expression needs to be re-evaluated.
   *
   * @property {String[]} dependsOn
   * @accessor
   */
  dependsOn: computed("isHidden", "isRequired", function() {
    const keys = ["isHidden", "isRequired"];

    return keys.reduce((obj, key) => {
      const dependents = [
        ...new Set(
          getTransforms(getAST(this[key]))
            .filter(transform => transform.name === "answer")
            .map(transform => transform.subject.value)
        )
      ];

      return Object.assign(obj, {
        [key]: dependents.map(slugWithPath => {
          const field = this.document.findField(slugWithPath);

          field.registerDependentField(this.field, key);

          return field;
        })
      });
    }, {});
  }).readOnly(),

  /**
   * Evaluate the question's hidden state.
   *
   * A question is hidden if
   * * all of the `dependsOn` questions are hidden or empty, or
   * * the JEXL expression evaluates to `true`
   *
   * @method hiddenTask.perform
   * @return {Boolean}
   */
  hiddenTask: task(function*() {
    let hidden =
      this.dependsOn.isHidden.length &&
      this.dependsOn.isHidden.every(
        field =>
          field.question.hidden ||
          (field.question.__typename !== "TableQuestion" &&
            (field.answer.value === null || field.answer.value === undefined))
      );

    hidden =
      hidden ||
      (yield this.field.fieldset.document.questionJexl.eval(
        this.isHidden,
        this.field.fieldset.document.questionJexlContext
      ));

    if (this.get("hiddenTask.lastSuccessful.value") !== hidden) {
      next(this, () => this.field.trigger("hiddenChanged"));
    }

    return hidden;
  }),
  hidden: lastValue("hiddenTask"),

  /**
   * Boolean which tells whether the question is optional or not
   * (opposite of "required")
   *
   * @property {Boolean} optional
   * @accessor
   */
  optional: lastValue("optionalTask"),

  /**
   * Evaluate the question's optional state by executing the corresponding
   * JEXL expression.
   *
   * @method optionalTask.perform
   * @return {Boolean}
   */
  optionalTask: task(function*() {
    const hidden =
      this.dependsOn.isRequired.length &&
      this.dependsOn.isRequired.every(
        field =>
          field.question.hidden ||
          (field.question.__typename !== "TableQuestion" &&
            (field.answer.value === null || field.answer.value === undefined))
      );

    return (
      hidden ||
      !(yield this.field.fieldset.document.questionJexl.eval(
        this.isRequired,
        this.field.fieldset.document.questionJexlContext
      ))
    );
  })
});
