import { getOwner } from "@ember/application";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import { confirm } from "ember-uikit";

import removeDocumentMutation from "@projectcaluma/ember-form/gql/mutations/remove-document.graphql";
import saveDocumentMutation from "@projectcaluma/ember-form/gql/mutations/save-document.graphql";
import { parseDocument } from "@projectcaluma/ember-form/lib/parsers";

export default class CfFieldInputTableComponent extends Component {
  @service notification;
  @service intl;
  @service calumaStore;

  @queryManager apollo;

  @tracked showAddModal = false;
  @tracked documentToEdit = null;
  @tracked documentToEditIsNew = false;

  parseDocument(raw) {
    return parseDocument(raw);
  }

  isDocumentAdded = (document) => {
    return this.args.compare && document?.raw?.historyType === "+";
  };
  isDocumentDeleted = (document) => {
    return this.args.compare && document?.raw?.historyType === "-";
  };
  isDocumentModified = (document) => {
    return this.args.compare && document?.raw?.historyType === "~";
  };

  get questions() {
    return this.args.field.question.raw.rowForm.questions.edges.map(
      (edge) => edge.node,
    );
  }

  get columns() {
    const config = this.args.field.question.raw.meta.columnsToDisplay;

    if (config?.length) {
      return this.questions.filter((question) =>
        config.includes(question.slug),
      );
    }

    return this.questions.slice(0, 4);
  }

  add = task({ drop: true }, async () => {
    const raw = await this.apollo.mutate(
      {
        mutation: saveDocumentMutation,
        variables: {
          input: { form: this.args.field.question.raw.rowForm.slug },
        },
      },
      "saveDocument.document",
    );

    const owner = getOwner(this);
    const Document = owner.factoryFor("caluma-model:document").class;
    const newDocument = new Document({
      raw: this.parseDocument(raw),
      parentDocument: this.args.field.document,
      parentField: this.args.field,
      owner,
    });

    // Open the modal immediately - attaching the row to the table (below) is
    // debounced and would otherwise noticeably delay opening the modal. While
    // this task runs, the row's fields and the cancel button are disabled in
    // the modal, so no answer can be saved to (and validated by) the backend
    // and the row cannot be removed again before it is attached to the table.
    this.documentToEditIsNew = true;
    this.documentToEdit = newDocument;
    this.showAddModal = true;

    // Attach the row document to the table answer, so the backend has the
    // full context to validate and evaluate the row's fields while editing.
    // `documentToEditIsNew` marks the row as preliminary, so it will be
    // removed again if the edit dialog is cancelled.
    try {
      const rows = this.args.field.answer.value ?? [];
      this.args.field.answer.value = [...rows, newDocument];
      await this.args.field.save.perform();
    } catch {
      this.notification.danger(
        this.intl.t("caluma.form.notification.table.add.error"),
      );

      // Attaching failed - remove the preliminary row and close the modal.
      // `close` cannot be performed here, as it waits for this task to finish.
      await this.deleteRow(this.documentToEdit);
      this.documentToEditIsNew = false;
      this.showAddModal = false;
      this.documentToEdit = null;
    }
  });

  /**
   * Delete row without asking. Remove from the table, then remove row document
   *
   * @async
   * @method deleteRow
   * @param {Document} document The row document to delete
   * @return {Promise<Void>}
   */
  async deleteRow(document) {
    const remainingDocuments = (this.args.field.answer.value ?? []).filter(
      (doc) => doc.pk !== document.pk,
    );

    // remove row from table
    await this.args.onSave(remainingDocuments);

    // delete row document
    await this.apollo.mutate({
      mutation: removeDocumentMutation,
      variables: { input: { document: document.uuid } },
    });

    // Remove orphaned document from Caluma store.
    this.calumaStore.delete(document.pk);
  }

  delete = task({ drop: true }, async (document) => {
    if (!(await confirm(this.intl.t("caluma.form.deleteRow")))) {
      return;
    }

    await this.deleteRow(document);
  });

  save = task({ drop: true }, async (validate) => {
    try {
      if (!(await validate())) {
        return;
      }

      const newDocument = this.documentToEdit;

      await Promise.all(newDocument.fields.map((f) => f.validate.perform()));

      if (newDocument.fields.some((field) => field.isInvalid)) {
        return;
      }

      if (this.documentToEditIsNew) {
        this.notification.success(
          this.intl.t("caluma.form.notification.table.add.success"),
        );
        this.documentToEditIsNew = false;
      }

      await this.close.perform();
    } catch {
      this.notification.danger(
        this.intl.t("caluma.form.notification.table.add.error"),
      );
    }
  });

  close = task({ drop: true }, async () => {
    // Wait for a pending "add" to finish attaching the new row to the table
    // before closing - otherwise removing or validating the row would race
    // with the debounced save of the table answer.
    if (this.add.isRunning) {
      await this.add.last;
    }

    if (this.documentToEditIsNew) {
      await this.deleteRow(this.documentToEdit);
      this.documentToEditIsNew = false;
      this.showAddModal = false;
      this.documentToEdit = null;
      // No validation for new documents that are deleted
      return;
    }

    if (!this.args.disabled) {
      await this.args.field.validate.perform();
    }

    this.showAddModal = false;
    this.documentToEdit = null;
  });

  @action
  edit(document) {
    this.documentToEdit = document;
    this.showAddModal = true;
  }
}
