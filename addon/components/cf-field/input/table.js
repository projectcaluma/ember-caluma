import Component from "@ember/component";
import layout from "../../../templates/components/cf-field/input/table";
import { task, all } from "ember-concurrency";
import saveDocumentMutation from "ember-caluma/gql/mutations/save-document";
import { inject as service } from "@ember/service";
import { ComponentQueryManager } from "ember-apollo-client";

/**
 * @babel/polyfill@^7.4.0 is supposed to include "flat", but that doesn't work of us -
 * presumably because transitive dependencies still include babel 6 and the
 * corresponding babel-polyfill package. So we include this "manual" polyfill for now.
 *
 * https://github.com/babel/babel/issues/9749
 */
function flat(arrays) {
  return [].concat.apply([], arrays);
}

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

    // update client-side state
    this.set("field.answer.rowDocuments", remainingDocuments);

    yield this.onSave(remainingDocuments.map(doc => doc.id));
  }),

  save: task(function*() {
    try {
      const newDocument = this.get("documentToEdit");
      yield all(newDocument.fields.map(f => f.validate.perform()));
      if (flat(newDocument.fields.map(f => f.errors)).length) {
        return;
      }

      const rows = this.getWithDefault("field.answer.rowDocuments", []);

      if (!rows.find(doc => doc.id === newDocument.id)) {
        // add document to table
        yield this.onSave([
          ...this.getWithDefault("field.answer.rowDocuments", []).map(
            doc => doc.id
          ),
          newDocument.id
        ]);

        // update client-side state
        this.set("field.answer.rowDocuments", [
          ...(this.get("field.answer.rowDocuments") || []),
          newDocument
        ]);
        this.get("notification").success(
          this.get("intl").t("caluma.form.notification.table.add.success")
        );
      } else {
        yield this.onSave([
          ...this.getWithDefault("field.answer.rowDocuments", []).map(
            doc => doc.id
          )
        ]);
      }

      this.set("showModal", false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      this.get("notification").danger(
        this.get("intl").t("caluma.form.notification.table.add.error")
      );
    }
  }),

  actions: {
    editRow(document) {
      this.setProperties({
        documentToEdit: document,
        showModal: true
      });
    }
  }
});
