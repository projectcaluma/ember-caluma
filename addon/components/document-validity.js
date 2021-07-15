import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { dropTask } from "ember-concurrency-decorators";

/**
 * Component to check the validity of a document
 *
 * ```hbs
 * <DocumentValidity @document={{this.calumaDocument}} as |isValid|>
 *  {{#if isValid}}
 *    <p>The document is valid</p>
 *  {{/if}}
 * </DocumentValidity>
 * ```
 *
 * @class DocumentValidity
 * @yield {Boolean} isValid
 */
export default class DocumentValidity extends Component {
  /**
   * The document to be validated
   * @argument {Document} document
   */

  @tracked isValid = null;

  @dropTask
  *validate() {
    yield Promise.all(
      this.args.document.fields.map((field) => field.validate.perform())
    );

    this.isValid = this.args.document.fields.every((f) => f.isValid);
  }
}
