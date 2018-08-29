import Component from "@ember/component";
import layout from "../templates/components/cfb-form-editor";
import { task } from "ember-concurrency";
import { ComponentQueryManager } from "ember-apollo-client";
import { inject as service } from "@ember/service";
import v4 from "uuid/v4";

import formEditorQuery from "ember-caluma-form-builder/gql/queries/form-editor";
import reorderFormQuestionsMutation from "ember-caluma-form-builder/gql/mutations/reorder-form-questions";
import { computed } from "@ember/object";

export default Component.extend(ComponentQueryManager, {
  layout,

  notification: service(),
  intl: service(),

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

    return yield this.get("apollo").watchQuery(
      {
        query: formEditorQuery,
        variables: { id: this.get("formId") },
        fetchPolicy: "cache-and-network"
      },
      "node"
    );
  }).restartable(),

  reorderQuestions: task(function*(slugs) {
    try {
      let questionIds = slugs.map(slug => btoa(`Question:${slug}`));

      yield this.get("apollo").mutate({
        mutation: reorderFormQuestionsMutation,
        variables: {
          input: {
            formId: this.get("formId"),
            questionIds,
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
  })
});
