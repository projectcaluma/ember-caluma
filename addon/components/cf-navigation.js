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
  document: null,
  activeDocumentId: null,

  didReceiveAttrs() {
    this._super(...arguments);
    if (this.documentId) {
      this.data.perform();
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

  _document: computed("data.lastSuccessful.value", "document.id", function() {
    return (
      this.get("document") ||
      (this.get("data.lastSuccessful.value") &&
        this.documentStore.find(this.get("data.lastSuccessful.value")))
    );
  }).readOnly(),

  fields: computed("_document", function() {
    return (this.get("_document.fields") || [])
      .filter(field => field.question.__typename === "FormQuestion")
      .map(field => {
        field.set("childDocument", this.documentStore.find(field.answer.value));
        field.set(
          "navSubFields",
          field.subFields
            .filter(field => field.question.__typename === "FormQuestion")
            .filter(field => field.answer.value)
            .map(field => {
              field.set(
                "childDocument",
                this.documentStore.find(field.answer.value)
              );
              return field;
            })
        );
        return field;
      });
  })
});
