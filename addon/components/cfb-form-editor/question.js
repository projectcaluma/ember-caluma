import Component from "@ember/component";
import { inject as service } from "@ember/service";
import layout from "../../templates/components/cfb-form-editor/question";
import { task } from "ember-concurrency";
import { ComponentQueryManager } from "ember-apollo-client";
import validations, {
  POSSIBLE_TYPES
} from "ember-caluma-form-builder/validations/question";
import v4 from "uuid/v4";
import { optional } from "ember-composable-helpers/helpers/optional";
import { computed } from "@ember/object";

import formEditorQuestionQuery from "ember-caluma-form-builder/gql/queries/form-editor-question";
import saveQuestionMutation from "ember-caluma-form-builder/gql/mutations/save-question";

export default Component.extend(ComponentQueryManager, {
  layout,
  validations,

  notification: service(),
  intl: service(),

  possibleTypes: computed(function() {
    return POSSIBLE_TYPES.map(value => ({
      value,
      label: this.intl.t(`caluma.form-builder.question.types.${value}`)
    }));
  }),

  didReceiveAttrs() {
    this._super(...arguments);

    this.get("data").perform();
  },

  data: task(function*() {
    return yield this.get("apollo").watchQuery({
      query: formEditorQuestionQuery,
      variables: { id: btoa(`Question:${this.get("slug")}`) },
      fetchPolicy: "cache-and-network"
    });
  }).restartable(),

  submit: task(function*(changeset) {
    try {
      const question = yield this.get("apollo").mutate(
        {
          mutation: saveQuestionMutation,
          variables: {
            input: {
              label: changeset.get("label"),
              slug: changeset.get("slug"),
              type: changeset.get("type"),
              clientMutationId: v4()
            }
          }
        },
        "saveQuestion.question"
      );

      this.get("notification").success(
        this.get("intl").t(
          "caluma.form-builder.notification.question.save.success"
        )
      );

      optional([this.get("on-after-submit")])(question);
    } catch (e) {
      this.get("notification").danger(
        this.get("intl").t(
          "caluma.form-builder.notification.question.save.error"
        )
      );
    }
  }).drop()
});
