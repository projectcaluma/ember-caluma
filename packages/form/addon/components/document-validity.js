import { action } from "@ember/object";
import Component from "@glimmer/component";

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

  get isValid() {
    return this.args.document.fields.every((f) => f.isValid);
  }

  @action
  async validate() {
    await Promise.all(
      this.args.document.fields.map((field) => field.validate.perform())
    );

    if (this.isValid) {
      this.args.onValid?.();
    } else {
      this.args.onInvalid?.();
    }

    return this.isValid;
  }
}
