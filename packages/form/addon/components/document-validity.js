import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import { cached } from "tracked-toolbox";

import documentValidityQuery from "@projectcaluma/ember-form/gql/queries/document-validity.graphql";

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
  @queryManager apollo;

  @service calumaStore;

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

  get isValidating() {
    return this._validate.isRunning;
  }

  _validate = task({ restartable: true }, async () => {
    try {
      const saveTasks = this.args.document.fields
        .flatMap((field) => [
          ...[...(field._components ?? [])].map((c) => c.save.last),
          field.save?.last,
        ])
        .filter(Boolean);

      // Wait until all currently running save tasks in the UI and in the field
      // itself are finished
      await Promise.all(saveTasks);

      await Promise.all(
        this.args.document.fields.map((field) =>
          field.validate.linked().perform(),
        ),
      );

      const { isValid, errors } = await this.apollo.query(
        {
          query: documentValidityQuery,
          fetchPolicy: "network-only",
          variables: { id: this.args.document.uuid },
        },
        "documentValidity.edges.0.node",
      );

      if (!isValid) {
        errors
          .filter(({ errorCode }) => errorCode === "format_validation_failed")
          .forEach(({ slug, errorMsg, documentId }) => {
            const pk = `Document:${documentId}:Question:${slug}`;
            const field = this.calumaStore.findByPk(pk);
            const parentField = field.document.parentField;

            // Add the error manually as the frontend does not validate format
            // validators - only the backend.
            field.addManualError("format", { errorMsg }, field.value);

            if (parentField) {
              // If the affected field is in a table row, we need to mark the
              // table answer as invalid as well.
              parentField.addManualError("table", {}, null);
            }
          });
      }

      if (this.isValid) {
        this.args.onValid?.();
      } else {
        this.args.onInvalid?.();
      }

      return this.isValid;
    } catch {
      return false;
    }
  });

  @action
  validate() {
    return this._validate.perform();
  }
}
