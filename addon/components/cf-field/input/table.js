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
    let question = yield this.question;

    const newDocumentRaw = yield this.get("apollo").mutate(
      {
        mutation: saveDocumentMutation,
        variables: {
          input: { form: this.get("field.question.rowForm.slug") }
        }
      },
      "saveDocument.document"
    );
    yield this.get("apollo").mutate({
      mutation: saveDocumentTableAnswerMutation,
      variables: {
        input: {
          question: this.get("field.question.slug"),
          document: this.get("field.document.id"),
          value: [
            newDocumentRaw.id,
            ...this.getWithDefault("field.answer.rowDocuments", []).map(
              doc => doc.id
            )
          ]
        }
      }
    });

    const newDocument = this.documentStore.find(newDocumentRaw);

    // update client-side state
    this.set("field.answer.rowDocuments", [
      newDocument,
      ...this.get("field.answer.rowDocuments")
    ]);

    this.setProperties({
      documentToEdit: newDocument,
      showModal: true
    });
  }).drop(),

  editRow: task(function*(document) {
    this.setProperties({
      documentToEdit: document,
      showModal: true
    });
  }),

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

  save: task(function*(document) {
    console.log("saved", document);
    this.set("showModal", false);
  })
});
