import { getOwner } from "@ember/application";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { dropTask } from "ember-concurrency-decorators";

import { parseDocument } from "ember-caluma/lib/parsers";

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
    const document = getOwner(this)
      .factoryFor("caluma-model:document")
      .create({ raw: parseDocument(this.args.document) });

    yield Promise.all(document.fields.map((field) => field.validate.perform()));

    this.isValid = document.fields.every((f) => f.isValid);
  }
}
