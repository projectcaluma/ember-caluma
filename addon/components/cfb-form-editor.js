import Component from "@ember/component";
import layout from "../templates/components/cfb-form-editor";
import { task, timeout } from "ember-concurrency";
import { ComponentQueryManager } from "ember-apollo-client";
import { inject as service } from "@ember/service";
import v4 from "uuid/v4";
import { computed } from "@ember/object";
import { optional } from "ember-composable-helpers/helpers/optional";

import formEditorQuery from "ember-caluma-form-builder/gql/queries/form-editor";
import searchQuestionQuery from "ember-caluma-form-builder/gql/queries/search-question";
import reorderFormQuestionsMutation from "ember-caluma-form-builder/gql/mutations/reorder-form-questions";
import addFormQuestionMutation from "ember-caluma-form-builder/gql/mutations/add-form-question";

export default Component.extend(ComponentQueryManager, {
  layout,

  notification: service(),
  intl: service(),

  add: false,

  didReceiveAttrs() {
    this._super(...arguments);

    this.get("data").perform();
  },

  formId: computed("slug", function() {
    return btoa(`Form:${this.get("slug")}`);
  }),

  data: task(function*() {
    if (!this.get("slug")) {
      return null;
    }

    return yield this.get("apollo").watchQuery({
      query: formEditorQuery,
      variables: { id: this.get("formId") },
      fetchPolicy: "cache-and-network"
    });
  }).restartable(),

  reorderQuestions: task(function*(slugs) {
    try {
      let questions = slugs.map(slug => btoa(`Question:${slug}`));

      yield this.get("apollo").mutate({
        mutation: reorderFormQuestionsMutation,
        variables: {
          input: {
            form: this.get("formId"),
            questions,
            clientMutationId: v4()
          }
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

  search: task(function*(/*search*/) {
    yield timeout(500);

    return yield this.get("apollo").query(
      {
        query: searchQuestionQuery,
        variables: {
          // TODO: pass search argument when https://github.com/projectcaluma/caluma/issues/46 is implemented
        }
      },
      "allQuestions.edges"
    );
  }).restartable(),

  addQuestion: task(function*({ slug }) {
    try {
      yield this.get("apollo").mutate({
        mutation: addFormQuestionMutation,
        variables: {
          input: {
            question: btoa(`Question:${slug}`),
            form: this.get("formId"),
            clientMutationId: v4()
          }
        }
      });

      this.get("notification").success(
        this.get("intl").t(
          "caluma.form-builder.notification.form.add-question.success"
        )
      );

      this.set("add", false);

      optional([this.get("on-after-add-question")])(slug);
    } catch (e) {
      this.get("notification").danger(
        this.get("intl").t(
          "caluma.form-builder.notification.form.add-question.error"
        )
      );
    }
  }).enqueue()
});
