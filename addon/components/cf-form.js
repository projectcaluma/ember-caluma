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
 * @class CfFormComponent
 */
export default Component.extend(ComponentQueryManager, {
  layout,
  tagName: "form",
  apollo: service(),
  documentStore: service(),
  document: null,

  attributeBindings: ["novalidate"],
  novalidate: "novalidate",

  /**
   * The ID of the document to display
   * @argument {String} documentId
   */
  documentId: null,

  /**
   * Allows the whole form to be disabled.
   * @argument {Boolean} disabled
   */
  disabled: false,

  /**
   * A hash containg mappings for widget overrides.
   * Set the key of the hash to the slug of the question
   * and the value to the Ember component.
   *
   * ```hbs
   * {{cf-form
   *   documentId="the-id-of-your-document"
   *   overrides=(hash foo=(component "bar"))
   * }}
   * ```
   *
   * @argument {Object} overrides
   */
  overrides: null,

  /**
   * Can be used to pass "context" information from the outside through
   * to custom overrides.
   *
   * @argument {*} overrides
   */
  context: null,

  didReceiveAttrs() {
    this._super(...arguments);
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
  }).readOnly()
});
