import Component from "@ember/component";
import layout from "../templates/components/cf-navigation";
import { inject as service } from "@ember/service";
import { computed } from "@ember/object";
import { ComponentQueryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import getNavigationQuery from "ember-caluma/gql/queries/get-navigation";

export default Component.extend(ComponentQueryManager, {
  layout,
  documentStore: service(),

  documentId: null,
  activeDocumentId: null,

  _currentDocumentId: null,

  async didReceiveAttrs() {
    this._super(...arguments);
    if (this.documentId && this.documentId !== this._currentDocumentId) {
      await this.data.perform();
      this._currentDocumentId = this.documentId;
    }
  },

  data: task(function*() {
    return yield this.apollo.watchQuery(
      {
        query: getNavigationQuery,
        variables: { id: window.btoa("Document:" + this.documentId) },
        fetchPolicy: "network-only"
      },
      "node"
    );
  }),

  rootDocument: computed("data.lastSuccessful.value", function() {
    return (
      this.get("data.lastSuccessful.value") &&
      this.documentStore.find(this.get("data.lastSuccessful.value"))
    );
  }).readOnly(),

  displayedDocument: computed(
    "section",
    "subSection",
    "rootDocument",
    function() {
      try {
        if (!this.get("rootDocument")) {
          return null;
        }
        if (!this.get("section")) {
          return this.get("rootDocument");
        }
        const section = this.get("rootDocument.fields").find(
          field => field.question.slug === this.get("section")
        );

        if (!this.get("subSection")) {
          return section.childDocument;
        }
        return section.childDocument.fields.find(
          field => field.question.slug === this.get("subSection")
        ).childDocument;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        return null;
      } finally {
        window.scrollTo(0, 0);
      }
    }
  ),

  fields: computed("rootDocument", function() {
    const isFormQuestion = field =>
      field.question.__typename === "FormQuestion";
    return (this.get("rootDocument.fields") || [])
      .filter(isFormQuestion)
      .map(field => {
        field.set(
          "navSubFields",
          field.childDocument.fields.filter(isFormQuestion)
        );
        return field;
      });
  })
});
