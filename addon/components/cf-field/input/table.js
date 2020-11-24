import { getOwner } from "@ember/application";
import Component from "@ember/component";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import { queryManager } from "ember-apollo-client";
import { task, all } from "ember-concurrency";

import layout from "../../../templates/components/cf-field/input/table";

import removeDocumentMutation from "ember-caluma/gql/mutations/remove-document";
import saveDocumentMutation from "ember-caluma/gql/mutations/save-document";
import { parseDocument } from "ember-caluma/lib/parsers";

export default Component.extend({
  layout,

  notification: service(),
  intl: service(),
  calumaStore: service(),

  apollo: queryManager(),

  showAddModal: false,
  showDeleteModal: false,
  documentToEdit: null,
  documentToDelete: null,

  columnHeaders: computed(
    "field.question.{rowForm.questions.edges.@each,meta.columnsToDisplay.[]}",
    function () {
      if (this.get("field.question.meta.columnsToDisplay.length")) {
        return this.get("field.question.rowForm.questions.edges").filter((n) =>
          this.get("field.question.meta.columnsToDisplay").includes(n.node.slug)
        );
      }
      return this.get("field.question.rowForm.questions.edges").slice(0, 4);
    }
  ),

  addRow: task(function* () {
    const raw = yield this.apollo.mutate(
      {
        mutation: saveDocumentMutation,
        variables: {
          input: { form: this.get("field.question.rowForm.slug") },
        },
      },
      "saveDocument.document"
    );

    const newDocument = getOwner(this)
      .factoryFor("caluma-model:document")
      .create({ raw: parseDocument(raw), parentDocument: this.field.document });

    this.setProperties({
      documentToEdit: newDocument,
      showAddModal: true,
    });
  }).drop(),

  deleteRow: task(function* (document) {
    if (!this.field.answer.value) return;

    const remainingDocuments = this.field.answer.value.filter(
      (doc) => doc.pk !== document.pk
    );

    yield this.onSave(remainingDocuments);

    // Remove orphaned document from database.
    yield this.apollo.mutate({
      mutation: removeDocumentMutation,
      variables: { input: { document: document.uuid } },
    });

    // Remove orphand document from Caluma store.
    this.calumaStore.delete(document.pk);

    this.closeModal("showDeleteModal");
  }),

  save: task(function* () {
    try {
      const newDocument = this.documentToEdit;
      yield all(newDocument.fields.map((f) => f.validate.perform()));

      if (newDocument.fields.some((field) => field.isInvalid)) {
        return;
      }

      const rows = this.get("field.answer.value") || [];

      if (!rows.find((doc) => doc.pk === newDocument.pk)) {
        // add document to table
        yield this.onSave([...rows, newDocument]);

        this.notification.success(
          this.intl.t("caluma.form.notification.table.add.success")
        );
      }

      this.closeModal("showAddModal");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      this.notification.danger(
        this.intl.t("caluma.form.notification.table.add.error")
      );
    }
  }),

  closeModal(propertyName) {
    this.set(propertyName, false);

    this.field.validate.perform();
  },

  actions: {
    closeModal(propertyName) {
      this.closeModal(propertyName);
    },

    editRow(document) {
      this.setProperties({
        documentToEdit: document,
        showAddModal: true,
      });
    },

    deleteRow(document) {
      this.setProperties({
        documentToDelete: document,
        showDeleteModal: true,
      });
    },
  },
});
