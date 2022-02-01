import { action } from "@ember/object";
import Component from "@glimmer/component";
import { restartableTask } from "ember-concurrency";
import { cached } from "tracked-toolbox";

/**
 * Component to check the validity of a document
 *
 * ```hbs
 * <DocumentValidity @document={{this.calumaDocument}} as |isValid validate|>
 *  {{#if isValid}}
 *    <p>The document is valid</p>
 *  {{/if}}
 *  <button {{on "click" validate}}>Validate!</button>
 * </DocumentValidity>
 * ```
 *
 * @class DocumentValidity
 * @yield {Boolean} isValid
 * @yield {Function} validate
 */
export default class DocumentValidity extends Component {
  /**
   * The document to be validated
   *
   * @argument {Document} document
   */

  /**
   * Whether to validate the document on entering the viewport. Default is `false`.
   *
   * @argument {Boolean} validateOnEnter
   */

  @cached
  get isValid() {
    return this.args.document.fields
      .filter((f) => !f.hidden)
      .every((f) => f.isValid);
  }

  @restartableTask
  *_validate() {
    const saveTasks = this.args.document.fields
      .flatMap((field) => [
        ...[...(field._components ?? [])].map((c) => c.save.last),
        field.save?.last,
      ])
      .filter(Boolean);

    // Wait until all currently running save tasks in the UI and in the field
    // itself are finished
    yield Promise.all(saveTasks);

    for (const field of this.args.document.fields) {
      yield field.validate.linked().perform();
    }

    if (this.isValid) {
      this.args.onValid?.();
    } else {
      this.args.onInvalid?.();
    }

    return this.isValid;
  }

  @action
  validate() {
    return this._validate.perform();
  }
}
