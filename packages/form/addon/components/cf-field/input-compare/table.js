import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency";

export default class CfFieldInputTableCompareComponent extends Component {
  @service notification;
  @service intl;
  @service calumaStore;

  @queryManager apollo;

  @tracked documentToEdit = null;
  @tracked documentToEditIsNew = false;

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

  @dropTask
  *close() {
    this.showAddModal = false;
    return yield (this.documentToEdit = null);
  }

  @action
  edit(document) {
    this.documentToEdit = document;
    this.showAddModal = true;
  }
}
