import Component from "@ember/component";
import layout from "../../../templates/components/cf-field/input/table";
import { task, all } from "ember-concurrency";
import saveDocumentMutation from "ember-caluma/gql/mutations/save-document";
import saveDocumentTableAnswerMutation from "ember-caluma/gql/mutations/save-document-table-answer";
import { inject as service } from "@ember/service";
import { ComponentQueryManager } from "ember-apollo-client";

export default Component.extend(ComponentQueryManager, {
  layout,

  notification: service(),

  documentStore: service(),

  intl: service(),

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
    async save() {
      try {
        const newDocument = this.get("documentToEdit");
        await all(newDocument.fields.map(f => f.validate.perform()));
        if (newDocument.fields.map(f => f.errors).flat().length) {
          return;
        }

        const rows = this.getWithDefault("field.answer.rowDocuments", []);

        if (!rows.find(doc => doc.id === newDocument.id)) {
          // add document to table
          await this.get("apollo").mutate({
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
          this.get("notification").success(
            this.get("intl").t("caluma.form.notification.table.add.success")
          );
        }

        this.set("showModal", false);
      } catch (e) {
        this.get("notification").danger(
          this.get("intl").t("caluma.form.notification.table.add.error")
        );
      }
    },
    editRow(document) {
      this.setProperties({
        documentToEdit: document,
        showModal: true
      });
    }
  }
});
