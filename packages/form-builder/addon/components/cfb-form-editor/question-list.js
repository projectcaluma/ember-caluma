import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { macroCondition, isTesting } from "@embroider/macros";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { timeout, task } from "ember-concurrency";
import { trackedTask } from "reactiveweb/ember-concurrency";

import addFormQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/add-form-question.graphql";
import removeFormQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/remove-form-question.graphql";
import reorderFormQuestionsMutation from "@projectcaluma/ember-form-builder/gql/mutations/reorder-form-questions.graphql";
import searchFormQuestionQuery from "@projectcaluma/ember-form-builder/gql/queries/search-form-question.graphql";
import searchQuestionQuery from "@projectcaluma/ember-form-builder/gql/queries/search-question.graphql";

export default class ComponentsCfbFormEditorQuestionList extends Component {
  @service notification;
  @service intl;

  @queryManager apollo;

  @tracked search = "";
  @tracked mode = this.args.mode || "reorder";
  @tracked cursor = null;
  @tracked hasNextPage = true;

  nextCursor = null;
  items = [];

  searchTask = task({ restartable: true }, async (event) => {
    /* istanbul ignore next */
    if (macroCondition(isTesting())) {
      // no timeout
    } else {
      await timeout(500);
    }

    this.search = event.target.value;
    this._resetParameters();
  });

  questionTask = task({ restartable: true }, async (mode, input, cursor) => {
    const search = mode !== "reorder" ? input : "";

    if (mode === "add") {
      const questions = await this.apollo.watchQuery(
        {
          query: searchQuestionQuery,
          variables: {
            search,
            excludeForms: [this.args.form],
            pageSize: 20,
            cursor,
          },
          fetchPolicy: "network-only",
        },
        "allQuestions",
      );

      this.nextCursor = questions.pageInfo.endCursor;
      this.hasNextPage = questions.pageInfo.hasNextPage;

      this.items = [...this.items, ...questions.edges];

      return this.items;
    }

    return await this.apollo.watchQuery(
      {
        query: searchFormQuestionQuery,
        variables: {
          search,
          slug: this.args.form,
        },
        fetchPolicy: "cache-and-network",
      },
      "allForms.edges.0.node.questions.edges",
    );
  });

  questions = trackedTask(this, this.questionTask, () => [
    this.mode,
    this.search,
    this.cursor,
  ]);

  reorderQuestions = task({ restartable: true }, async (slugs) => {
    try {
      await this.apollo.mutate({
        mutation: reorderFormQuestionsMutation,
        variables: {
          input: {
            form: this.args.form,
            questions: slugs,
          },
          search: "",
        },
      });

      this.notification.success(
        this.intl.t(
          "caluma.form-builder.notification.form.reorder-questions.success",
        ),
      );
    } catch {
      this.notification.danger(
        this.intl.t(
          "caluma.form-builder.notification.form.reorder-questions.error",
        ),
      );
    }
  });

  addQuestion = task({ enqueue: true }, async (question) => {
    try {
      await this.apollo.mutate({
        mutation: addFormQuestionMutation,
        variables: {
          input: {
            question: question.slug,
            form: this.args.form,
          },
          search: this.search,
        },
      });

      this.notification.success(
        this.intl.t(
          "caluma.form-builder.notification.form.add-question.success",
        ),
      );

      this._resetParameters();

      this.args.onAfterAddQuestion?.(question);
    } catch {
      this.notification.danger(
        this.intl.t("caluma.form-builder.notification.form.add-question.error"),
      );
    }
  });

  removeQuestion = task({ enqueue: true }, async (question) => {
    try {
      await this.apollo.mutate({
        mutation: removeFormQuestionMutation,
        variables: {
          input: {
            question: question.slug,
            form: this.args.form,
          },
          search: this.search,
        },
      });

      this.notification.success(
        this.intl.t(
          "caluma.form-builder.notification.form.remove-question.success",
        ),
      );

      this.args.onAfterRemoveQuestion?.(question);
    } catch {
      this.notification.danger(
        this.intl.t(
          "caluma.form-builder.notification.form.remove-question.error",
        ),
      );
    }
  });

  _handleMoved = ({ detail: [sortable] }) => {
    this.reorderQuestions.perform(sortable.items.map((item) => item.id));
  };

  _resetParameters() {
    this.cursor = null;
    this.hasNextPage = true;
    this.items = [];
  }

  @action
  loadMore(e) {
    e.preventDefault();

    this.cursor = this.nextCursor;
  }

  @action
  setMode(mode) {
    this.mode = mode;

    if (mode === "add") {
      this._resetParameters();
    }
  }

  @action
  createNewQuestion(e) {
    e.preventDefault();

    this.args.onCreateQuestion?.();
    this.setMode("reorder");
  }
}
