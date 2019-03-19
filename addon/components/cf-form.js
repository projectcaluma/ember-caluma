import Component from "@ember/component";
import { inject as service } from "@ember/service";
import { computed } from "@ember/object";
import { ComponentQueryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import layout from "../templates/components/cf-form";

import getDocumentQuery from "ember-caluma/gql/queries/get-document";

/**
 * Component to display a form for a whole document.
 *
 * ```hbs
 * {{cf-form documentId="the-id-of-your-document"}}
 * ```
 *
 * You can disable the whole form by passing `disabled=true`.
 *
 * @class CfFormComponent
 * @argument {String} documentId The ID of the document to display
 */
export default Component.extend(ComponentQueryManager, {
  layout,
  tagName: "form",
  apollo: service(),
  documentStore: service(),
  document: null,

  willInsertElement() {
    if (this.documentId) {
      this.data.perform();
    }
  },

  data: task(function*() {
    return yield this.apollo.watchQuery(
      {
        query: getDocumentQuery,
        variables: { id: window.btoa("Document:" + this.documentId) },
        fetchPolicy: "network-only"
      },
      "node"
    );
  }),

  /**
   * Transform raw data into document object
   *
   * @property {Document} _document
   * @accessor
   */
  _document: computed("data.lastSuccessful.value", "document.id", function() {
    return (
      this.get("document") ||
      (this.get("data.lastSuccessful.value") &&
        this.documentStore.find(this.get("data.lastSuccessful.value")))
    );
  }).readOnly(),

  actions: {
    async crossReference(slug, value) {
      const field = this._document.fields.find(
        field => field.question.slug === slug
      );

      if (field) {
        if (value === undefined) {
          return field.answer.value;
        } else {
          field.answer.set("value", value);
          field.save.unlinked().perform();
        }
      }
    }
  }
});
