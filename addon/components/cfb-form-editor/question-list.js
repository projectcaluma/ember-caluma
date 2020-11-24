import { action } from "@ember/object";
import { run } from "@ember/runloop";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { optional } from "ember-composable-helpers/helpers/optional";
import { timeout } from "ember-concurrency";
import {
  restartableTask,
  enqueueTask,
  lastValue,
} from "ember-concurrency-decorators";
import UIkit from "uikit";
import { v4 } from "uuid";

import addFormQuestionMutation from "ember-caluma/gql/mutations/add-form-question";
import removeFormQuestionMutation from "ember-caluma/gql/mutations/remove-form-question";
import reorderFormQuestionsMutation from "ember-caluma/gql/mutations/reorder-form-questions";
import searchFormQuestionQuery from "ember-caluma/gql/queries/search-form-question";
import searchQuestionQuery from "ember-caluma/gql/queries/search-question";

export default class ComponentsCfbFormEditorQuestionList extends Component {
  @service notification;
  @service intl;

  @queryManager apollo;

  @tracked _search = "";
  @tracked mode = this.args.mode || "reorder";
  @tracked _children = [];
  @tracked cursor = null;
  @tracked hasNextPage = true;
  @tracked items = [];

  get questions() {
    return this.mode === "add"
      ? this.questionTaskValue
      : this.questionTaskValue.firstObject?.node.questions.edges;
  }

  // Use built in input component when it works instead of this getter and setter
  get search() {
    return this._search;
  }
  set search(event) {
    this._search = event.target.value;
    this._resetParameters();
    this.questionTask.perform();
  }

  @lastValue("questionTask") questionTaskValue = [];
  @restartableTask
  *questionTask(event) {
    if (event?.preventDefault) {
      event.preventDefault();
    }

    const mode = this.mode;
    const search = mode !== "reorder" ? this.search : "";

    if (search) {
      yield timeout(500);
    }

    if (mode === "add" && this.hasNextPage) {
      const questions = yield this.apollo.watchQuery(
        {
          query: searchQuestionQuery,
          variables: {
            search,
            excludeForms: [this.args.form],
            pageSize: 20,
            cursor: this.cursor,
          },
          fetchPolicy: "network-only",
        },
        "allQuestions"
      );

      this.cursor = questions.pageInfo.endCursor;
      this.hasNextPage = questions.pageInfo.hasNextPage;

      this.items = [...this.items, ...questions.edges];

      return this.items;
    }

    return yield this.apollo.watchQuery(
      {
        query: searchFormQuestionQuery,
        variables: {
          search,
          slug: this.args.form,
        },
        fetchPolicy: "cache-and-network",
      },
      "allForms.edges"
    );
  }

  @restartableTask
  *reorderQuestions(slugs) {
    try {
      yield this.apollo.mutate({
        mutation: reorderFormQuestionsMutation,
        variables: {
          input: {
            form: this.args.form,
            questions: slugs,
            clientMutationId: v4(),
          },
          search: "",
        },
      });

      this.notification.success(
        this.intl.t("caluma.form-builder.notification.form.reorder.success")
      );
    } catch (e) {
      this.notification.danger(
        this.intl.t("caluma.form-builder.notification.form.reorder.error")
      );
    }
  }

  @enqueueTask
  *addQuestion(question) {
    try {
      yield this.apollo.mutate({
        mutation: addFormQuestionMutation,
        variables: {
          input: {
            question: question.slug,
            form: this.args.form,
            clientMutationId: v4(),
          },
          search: this.search,
        },
      });

      this.notification.success(
        this.intl.t(
          "caluma.form-builder.notification.form.add-question.success"
        )
      );

      this._resetParameters();

      this.questionTask.perform();

      optional([this.args["on-after-add-question"]])(question);
    } catch (e) {
      this.notification.danger(
        this.intl.t("caluma.form-builder.notification.form.add-question.error")
      );
    }
  }

  @enqueueTask
  *removeQuestion(question) {
    try {
      yield this.apollo.mutate({
        mutation: removeFormQuestionMutation,
        variables: {
          input: {
            question: question.slug,
            form: this.args.form,
            clientMutationId: v4(),
          },
          search: this.search,
        },
      });

      this.notification.success(
        this.intl.t(
          "caluma.form-builder.notification.form.remove-question.success"
        )
      );

      optional([this.args["on-after-remove-question"]])(question);
    } catch (e) {
      this.notification.danger(
        this.intl.t(
          "caluma.form-builder.notification.form.remove-question.error"
        )
      );
    }
  }

  _handleMoved({ detail: [sortable] }) {
    const children = [...sortable.$el.children];

    this.reorderQuestions.perform(
      children.map((child) => this._children[child.id])
    );
  }

  _resetParameters() {
    this.cursor = null;
    this.hasNextPage = true;
    this.items = [];
  }

  @action
  setupUIkit() {
    UIkit.util.on("#question-list", "moved", (...args) =>
      run(this, this._handleMoved, ...args)
    );
  }

  @action
  registerChild(elementId, slug) {
    this._children[elementId] = slug;
  }

  @action
  unregisterChild(elementId) {
    this._children[elementId] = undefined;
  }

  @action
  setMode(mode) {
    this.mode = mode;

    if (mode === "add") {
      this._resetParameters();
    }

    this.questionTask.perform();
  }

  @action
  performSearch() {
    this._resetParameters();
    this.questionTask.perform();
  }
}
