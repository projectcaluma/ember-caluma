import EmberObject, { computed } from "@ember/object";
import { next } from "@ember/runloop";
import { lastValue } from "ember-caluma/utils/concurrency";
import { getAST, getTransforms } from "ember-caluma/utils/jexl";
import { task } from "ember-concurrency";
// import { findFieldInTree } from "ember-caluma/utils/tree";

/**
 * Object which represents a question in context of a field
 *
 * @class Question
 */
export default EmberObject.extend({
  /**
   * Manual initialization of dynamic fields (e.g. hidden)
   *
   * Needed because _all_ fields need to be created before dynamic
   * field relationships can be resolved.
   *
   * @method initDynamicFields
   * @return {RSVP.Promise} Promise that resolves after init
   */
  async initDynamicFields() {
    await this.hiddenTask.perform();
    await this.optionalTask.perform();
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
  dependsOn: computed("isHidden", function() {
    const dependents = [
      ...new Set(
        getTransforms(getAST(this.isHidden))
          .filter(transform => transform.name === "answer")
          .map(transform => {
            return {
              slug: transform.subject.value,
              path: transform.args[0] && transform.args[0].value
            };
          })
      )
    ];
    return dependents.map(dependent => {
      const { slug, path } = dependent;
      const field = this.document.findField(slug, path);
      if (!field) {
        if (path) {
          throw new Error(
            `Field "${slug}" is not present in document "${path}"`
          );
        }
        throw new Error(`Field "${slug}" is not present in this document`);
      }
      // register dependent field
      // TODO: is this the right place to do this?
      field.dependentFields.push(this.field);
      return field;
    });
  }).readOnly(),

  /**
   * Evaluate the question's hidden state.
   *
   * A question is hidden if
   * * any of the `dependsOn` questions is hidden or empty, or
   * * the JEXL expression evaluates to `true`
   *
   * @method hiddenTask.perform
   * @return {Boolean}
   */
  hiddenTask: task(function*() {
    let hidden = this.dependsOn.some(
      field =>
        field.question.hidden ||
        field.answer.value === null ||
        field.answer.value === undefined
    );

    hidden =
      hidden || (yield this.field.document.questionJexl.eval(this.isHidden));

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
    return !(yield this.document.questionJexl.eval(this.isRequired));
  })
});
