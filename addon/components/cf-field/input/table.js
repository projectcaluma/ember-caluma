import Component from "@ember/component";
import layout from "../../../templates/components/cf-field/input/table";
import { task } from "ember-concurrency";
import saveDocumentMutation from "ember-caluma/gql/mutations/save-document";
import saveDocumentTableAnswerMutation from "ember-caluma/gql/mutations/save-document-table-answer";
import { inject as service } from "@ember/service";

export default Component.extend({
  layout,

  apollo: service(),

  showModal: false,
  documentToEdit: null,

  addRow: task(function*() {
    let question = yield this.question;

    const newDocument = yield this.get("apollo").mutate(
      {
        mutation: saveDocumentMutation,
        variables: {
          input: { form: this.get("field.question.rowForm.slug") }
        }
      },
      "saveDocument.document.id"
    );
    yield this.get("apollo").mutate({
      mutation: saveDocumentTableAnswerMutation,
      variables: {
        input: {
          question: this.get("field.question.slug"),
          document: this.get("field.document.id"),
          value: [
            newDocument,
            ...this.get("field.answer.rowDocuments").map(doc => doc.id)
          ]
        }
      }
    });

    console.log(newDocument);

    this.setProperties({
      documentToEdit: newDocument,
      showModal: true
    });
  }).drop(),

  editRow: task(function*(document) {
    this.setProperties({
      documentToEdit: document.id,
      showModal: true
    });
  }),

  deleteRow: task(function*(document) {
    yield this.get("apollo").mutate({
      mutation: saveDocumentTableAnswerMutation,
      variables: {
        input: {
          question: this.get("field.question.slug"),
          document: this.get("field.document.id"),
          value: this.get("field.answer.rowDocuments")
            .filter(doc => doc.id !== document.id)
            .map(doc => doc.id)
        }
      }
    });
  }),

  save: task(function*() {
    this.set("showModal", false);
  })
});
