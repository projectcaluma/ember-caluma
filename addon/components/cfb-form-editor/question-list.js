import Component from "@ember/component";
import layout from "../../templates/components/cfb-form-editor/question-list";
import UIkit from "uikit";
import { run } from "@ember/runloop";
import { optional } from "ember-composable-helpers/helpers/optional";
import { task, timeout } from "ember-concurrency";
import { ComponentQueryManager } from "ember-apollo-client";
import { computed } from "@ember/object";
import v4 from "uuid/v4";
import { inject as service } from "@ember/service";

import searchQuestionQuery from "ember-caluma/gql/queries/search-question";
import searchFormQuestionQuery from "ember-caluma/gql/queries/search-form-question";
import reorderFormQuestionsMutation from "ember-caluma/gql/mutations/reorder-form-questions";
import addFormQuestionMutation from "ember-caluma/gql/mutations/add-form-question";
import removeFormQuestionMutation from "ember-caluma/gql/mutations/remove-form-question";

export default Component.extend(ComponentQueryManager, {
  layout,
  tagName: "div",

  notification: service(),
  intl: service(),

  search: "",
  mode: "reorder",

  init() {
    this._super(...arguments);

    this.set("_children", {});
  },

  didReceiveAttrs() {
    this._super(...arguments);

    this.get("data").perform();
  },

  didInsertElement() {
    this._super(...arguments);

    UIkit.util.on(this.get("element"), "moved", (...args) =>
      run(this, this._handleMoved, ...args)
    );
  },

  questions: computed(
    "data.lastSuccessful.value.{[],firstObject.questions.edges.[]}",
    function() {
      return this.get("mode") === "add"
        ? this.get("data.lastSuccessful.value")
        : this.get(
            "data.lastSuccessful.value.firstObject.node.questions.edges"
          );
    }
  ),

  data: task(function*() {
    const mode = this.get("mode");
    const search = mode !== "reorder" ? this.get("search") : "";

    if (search) {
      yield timeout(500);
    }

    if (mode === "add") {
      return yield this.get("apollo").watchQuery(
        {
          query: searchQuestionQuery,
          variables: {
            search,
            excludeForms: [this.get("form")]
          },
          fetchPolicy: "cache-and-network"
        },
        "allQuestions.edges"
      );
    }

    return yield this.get("apollo").watchQuery(
      {
        query: searchFormQuestionQuery,
        variables: {
          search,
          slug: this.get("form")
        },
        fetchPolicy: "cache-and-network"
      },
      "allForms.edges"
    );
  }).restartable(),

  reorderQuestions: task(function*(slugs) {
    try {
      yield this.get("apollo").mutate({
        mutation: reorderFormQuestionsMutation,
        variables: {
          input: {
            form: this.get("form"),
            questions: slugs,
            clientMutationId: v4()
          },
          search: ""
        }
      });

      this.get("notification").success(
        this.get("intl").t(
          "caluma.form-builder.notification.form.reorder.success"
        )
      );
    } catch (e) {
      this.get("notification").danger(
        this.get("intl").t(
          "caluma.form-builder.notification.form.reorder.error"
        )
      );
    }
  }).restartable(),

  addQuestion: task(function*(question) {
    try {
      yield this.get("apollo").mutate({
        mutation: addFormQuestionMutation,
        variables: {
          input: {
            question: question.slug,
            form: this.get("form"),
            clientMutationId: v4()
          },
          search: this.get("search")
        }
      });

      this.get("notification").success(
        this.get("intl").t(
          "caluma.form-builder.notification.form.add-question.success"
        )
      );

      this.get("data").perform();

      optional([this.get("on-after-add-question")])(question);
    } catch (e) {
      this.get("notification").danger(
        this.get("intl").t(
          "caluma.form-builder.notification.form.add-question.error"
        )
      );
    }
  }).enqueue(),

  removeQuestion: task(function*(question) {
    try {
      yield this.get("apollo").mutate({
        mutation: removeFormQuestionMutation,
        variables: {
          input: {
            question: question.slug,
            form: this.get("form"),
            clientMutationId: v4()
          },
          search: this.get("search")
        }
      });

      this.get("notification").success(
        this.get("intl").t(
          "caluma.form-builder.notification.form.remove-question.success"
        )
      );

      optional([this.get("on-after-remove-question")])(question);
    } catch (e) {
      this.get("notification").danger(
        this.get("intl").t(
          "caluma.form-builder.notification.form.remove-question.error"
        )
      );
    }
  }).enqueue(),

  _handleMoved({ detail: [sortable] }) {
    let children = [...sortable.$el.children];

    this.get("reorderQuestions").perform(
      children.map(child => this.get(`_children.${child.id}`))
    );
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

      this.get("data").perform();
    }
  }
});
