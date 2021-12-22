import { getOwner } from "@ember/application";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency-decorators";
import UIkit from "uikit";

import removeDocumentMutation from "@projectcaluma/ember-form/gql/mutations/remove-document.graphql";
import saveDocumentMutation from "@projectcaluma/ember-form/gql/mutations/save-document.graphql";
import { parseDocument } from "@projectcaluma/ember-form/lib/parsers";

async function confirm(text) {
  try {
    await UIkit.modal.confirm(text);

    return true;
  } catch (error) {
    return false;
  }
}

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

  get questions() {
    return this.args.field.question.raw.rowForm.questions.edges.map(
      (edge) => edge.node
    );
  }

  get columns() {
    const config = this.args.field.question.raw.meta.columnsToDisplay;

    if (config?.length) {
      return this.questions.filter((question) =>
        config.includes(question.slug)
      );
    }

    return this.questions.slice(0, 4);
  }

  @dropTask
  *add() {
    const raw = yield this.apollo.mutate(
      {
        mutation: saveDocumentMutation,
        variables: {
          input: { form: this.args.field.question.raw.rowForm.slug },
        },
      },
      "saveDocument.document"
    );

    const owner = getOwner(this);
    const newDocument = new (owner.factoryFor("caluma-model:document").class)({
      raw: this.parseDocument(raw),
      parentDocument: this.args.field.document,
      owner,
    });

    this.documentToEditIsNew = true;
    this.documentToEdit = newDocument;
    this.showAddModal = true;
  }

  @dropTask
  *delete(document) {
    if (!(yield confirm(this.intl.t("caluma.form.deleteRow")))) {
      return;
    }

    const remainingDocuments = this.args.field.answer.value.filter(
      (doc) => doc.pk !== document.pk
    );

    yield this.args.onSave(remainingDocuments);
    yield this.removeOrphan(document);
  }

  @dropTask
  *save(validate) {
    try {
      if (!(yield validate())) {
        return;
      }

      const newDocument = this.documentToEdit;

      yield Promise.all(newDocument.fields.map((f) => f.validate.perform()));

      if (newDocument.fields.some((field) => field.isInvalid)) {
        return;
      }

      const rows = this.args.field.answer.value ?? [];

      if (!rows.find((doc) => doc.pk === newDocument.pk)) {
        // add document to table
        yield this.args.onSave([...rows, newDocument]);

        this.notification.success(
          this.intl.t("caluma.form.notification.table.add.success")
        );
      }

      this.documentToEditIsNew = false;

      yield this.close.perform();
    } catch (e) {
      this.notification.danger(
        this.intl.t("caluma.form.notification.table.add.error")
      );
    }
  }

  @dropTask
  *close() {
    if (this.documentToEditIsNew) {
      yield this.removeOrphan(this.documentToEdit);

      this.documentToEditIsNew = false;
    }

    this.showAddModal = false;
    this.documentToEdit = null;
  }

  async removeOrphan(calumaDocument) {
    // Remove orphaned document from database.
    await this.apollo.mutate({
      mutation: removeDocumentMutation,
      variables: { input: { document: calumaDocument.uuid } },
    });

    // Remove orphaned document from Caluma store.
    this.calumaStore.delete(calumaDocument.pk);
  }

  @action
  edit(document) {
    this.documentToEdit = document;
    this.showAddModal = true;
  }
}
