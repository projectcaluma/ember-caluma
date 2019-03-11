import Component from "@ember/component";
import layout from "../../../templates/components/cf-field/input/table";
import { task } from "ember-concurrency";
import saveDocumentMutation from "ember-caluma/gql/mutations/save-document";
import saveDocumentTableAnswerMutation from "ember-caluma/gql/mutations/save-document-table-answer";
import { inject as service } from "@ember/service";

export default Component.extend({
  layout,

  apollo: service(),

  documentStore: service(),

  showModal: false,
  documentToEdit: null,

  addRow: task(function*() {
    const newDocumentRaw = yield this.get("apollo").mutate(
      {
        mutation: saveDocumentMutation,
        variables: {
          input: { form: this.get("field.question.rowForm.slug") }
        }
      },
      "saveDocument.document"
    );
    const newDocument = this.documentStore.find(newDocumentRaw);

    yield this.get("apollo").mutate({
      mutation: saveDocumentTableAnswerMutation,
      variables: {
        input: {
          question: this.get("field.question.slug"),
          document: this.get("field.document.id"),
          value: [
            ...this.getWithDefault("field.answer.rowDocuments", []).map(
              doc => doc.id
            ),
            newDocument.id
          ]
        }
      }
    });

    // update client-side state
    this.set("field.answer.rowDocuments", [
      ...(this.get("field.answer.rowDocuments") || []),
      newDocument
    ]);

    this.setProperties({
      documentToEdit: newDocument,
      showModal: true
    });
  }).drop(),

  deleteRow: task(function*(document) {
    const remainingDocuments = this.get("field.answer.rowDocuments").filter(
      doc => doc.id !== document.id
    );

    yield this.get("apollo").mutate({
      mutation: saveDocumentTableAnswerMutation,
      variables: {
        input: {
          question: this.get("field.question.slug"),
          document: this.get("field.document.id"),
          value: remainingDocuments.map(doc => doc.id)
        }
      }
    });

    // update client-side state
    this.set("field.answer.rowDocuments", remainingDocuments);
  }),

  actions: {
    save() {
      this.set("showModal", false);
    },
    editRow(document) {
      this.setProperties({
        documentToEdit: document,
        showModal: true
      });
    }
  }
});
