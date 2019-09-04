import Component from "@ember/component";
import layout from "../../../templates/components/cf-field/input/table";
import { task, all } from "ember-concurrency";
import saveDocumentMutation from "ember-caluma/gql/mutations/save-document";
import { inject as service } from "@ember/service";
import { queryManager } from "ember-apollo-client";
import { computed } from "@ember/object";
import { getOwner } from "@ember/application";
import Document from "ember-caluma/lib/document";
import { parseDocument } from "ember-caluma/lib/parsers";

export default Component.extend({
  layout,

  apollo: queryManager(),

  notification: service(),
  intl: service(),

  showAddModal: false,
  showDeleteModal: false,
  documentToEdit: null,
  documentToDelete: null,

  columnHeaders: computed(
    "field.question.{rowForm.questions.edges.@each,meta.columnsToDisplay.[]}",
    function() {
      if (this.get("field.question.meta.columnsToDisplay.length")) {
        return this.get("field.question.rowForm.questions.edges").filter(n =>
          this.get("field.question.meta.columnsToDisplay").includes(n.node.slug)
        );
      }
      return this.get("field.question.rowForm.questions.edges").slice(0, 4);
    }
  ),

  addRow: task(function*() {
    const raw = yield this.get("apollo").mutate(
      {
        mutation: saveDocumentMutation,
        variables: {
          input: { form: this.get("field.question.rowForm.slug") }
        }
      },
      "saveDocument.document"
    );

    const newDocument = Document.create(getOwner(this).ownerInjection(), {
      raw: parseDocument(raw)
    });

    this.setProperties({
      documentToEdit: newDocument,
      showAddModal: true
    });
  }).drop(),

  deleteRow: task(function*(document) {
    if (!this.field.answer.value) return;

    const remainingDocuments = this.field.answer.value.filter(
      doc => doc.pk !== document.pk
    );

    yield this.onSave(remainingDocuments);

    this.set("showDeleteModal", false);
  }),

  save: task(function*() {
    try {
      const newDocument = this.get("documentToEdit");
      yield all(newDocument.fields.map(f => f.validate.perform()));

      if (newDocument.fields.some(field => field.isInvalid)) {
        return;
      }

      const rows = this.get("field.answer.value") || [];

      if (!rows.find(doc => doc.pk === newDocument.pk)) {
        // add document to table
        yield this.onSave([...rows, newDocument]);

        this.get("notification").success(
          this.get("intl").t("caluma.form.notification.table.add.success")
        );
      } else {
        // TODO: delete dangling document
        yield this.onSave([...rows]);
      }

      this.set("showAddModal", false);
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
        showAddModal: true
      });
    },
    deleteRow(document) {
      this.setProperties({
        documentToDelete: document,
        showDeleteModal: true
      });
    }
  }
});
