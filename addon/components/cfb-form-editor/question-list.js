import Component from "@ember/component";
import layout from "../../templates/components/cfb-form-editor/question-list";
import UIkit from "uikit";
import { run } from "@ember/runloop";
import { optional } from "ember-composable-helpers/helpers/optional";
import { task, timeout } from "ember-concurrency";
import { queryManager } from "ember-apollo-client";
import { computed } from "@ember/object";
import { v4 } from "uuid";
import { inject as service } from "@ember/service";

import searchQuestionQuery from "ember-caluma/gql/queries/search-question";
import searchFormQuestionQuery from "ember-caluma/gql/queries/search-form-question";
import reorderFormQuestionsMutation from "ember-caluma/gql/mutations/reorder-form-questions";
import addFormQuestionMutation from "ember-caluma/gql/mutations/add-form-question";
import removeFormQuestionMutation from "ember-caluma/gql/mutations/remove-form-question";

export default Component.extend({
  layout,
  tagName: "div",

  notification: service(),
  intl: service(),

  apollo: queryManager(),

  search: "",
  mode: "reorder",

  cursor: null,
  hasNextPage: true,

  init() {
    this._super(...arguments);

    this.set("_children", {});
    this.set("items", []);
  },

  didReceiveAttrs() {
    this._super(...arguments);

    this.data.perform();
  },

  didInsertElement() {
    this._super(...arguments);

    UIkit.util.on(this.element, "moved", (...args) =>
      run(this, this._handleMoved, ...args)
    );
  },

  questions: computed(
    "data.lastSuccessful.value.{[],firstObject.node.questions.edges,firstObject.questions.edges.[]}",
    "mode",
    function () {
      return this.mode === "add"
        ? this.get("data.lastSuccessful.value")
        : this.get(
            "data.lastSuccessful.value.firstObject.node.questions.edges"
          );
    }
  ),

  data: task(function* (event) {
    event?.preventDefault();

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
            excludeForms: [this.form],
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
          slug: this.form,
        },
        fetchPolicy: "cache-and-network",
      },
      "allForms.edges"
    );
  }).restartable(),

  reorderQuestions: task(function* (slugs) {
    try {
      yield this.apollo.mutate({
        mutation: reorderFormQuestionsMutation,
        variables: {
          input: {
            form: this.form,
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
  }).restartable(),

  addQuestion: task(function* (question) {
    try {
      yield this.apollo.mutate({
        mutation: addFormQuestionMutation,
        variables: {
          input: {
            question: question.slug,
            form: this.form,
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

      this.data.perform();

      optional([this.get("on-after-add-question")])(question);
    } catch (e) {
      this.notification.danger(
        this.intl.t("caluma.form-builder.notification.form.add-question.error")
      );
    }
  }).enqueue(),

  removeQuestion: task(function* (question) {
    try {
      yield this.apollo.mutate({
        mutation: removeFormQuestionMutation,
        variables: {
          input: {
            question: question.slug,
            form: this.form,
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

      optional([this.get("on-after-remove-question")])(question);
    } catch (e) {
      this.notification.danger(
        this.intl.t(
          "caluma.form-builder.notification.form.remove-question.error"
        )
      );
    }
  }).enqueue(),

  _handleMoved({ detail: [sortable] }) {
    let children = [...sortable.$el.children];

    this.reorderQuestions.perform(
      children.map((child) => this.get(`_children.${child.id}`))
    );
  },

  _resetParameters() {
    this.cursor = null;
    this.hasNextPage = true;
    this.items = [];
  },

  actions: {
    registerChild(elementId, slug) {
      this.set(`_children.${elementId}`, slug);
    },

    unregisterChild(elementId) {
      this.set(`_children.${elementId}`, undefined);
    },

    setMode(mode) {
      this.set("mode", mode);

      if (mode === "add") {
        this._resetParameters();
      }

      this.data.perform();
    },

    search(input) {
      this.search = input;
      this._resetParameters();
      this.data.perform();
    },
  },
});
