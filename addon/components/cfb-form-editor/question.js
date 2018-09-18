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
import slugify from "ember-caluma-form-builder/utils/slugify";

import formEditorQuestionQuery from "ember-caluma-form-builder/gql/queries/form-editor-question";
import saveQuestionMutation from "ember-caluma-form-builder/gql/mutations/save-question";
import addFormQuestionMutation from "ember-caluma-form-builder/gql/mutations/add-form-question";

export default Component.extend(ComponentQueryManager, {
  layout,
  validations,

  notification: service(),
  intl: service(),

  formId: computed("formSlug", function() {
    return this.get("formSlug") && btoa(`Form:${this.get("formSlug")}`);
  }),

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
    if (!this.get("slug")) {
      return {
        node: {
          label: "",
          slug: "",
          type: "TEXT",
          isRequired: "false",
          isHidden: "false"
        }
      };
    }

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
              isRequired: changeset.get("isRequired"),
              isHidden: "false", // TODO: this must be configurable
              clientMutationId: v4()
            }
          }
        },
        "saveQuestion.question"
      );

      if (!this.get("slug") && this.get("formId")) {
        // This is a new question which must be added to the form after creating it
        yield this.get("apollo").mutate({
          mutation: addFormQuestionMutation,
          variables: {
            input: {
              question: btoa(`Question:${question.slug}`),
              form: this.get("formId"),
              clientMutationId: v4()
            }
          }
        });
      }

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
  }).drop(),

  actions: {
    inputLabel(value, changeset) {
      changeset.set("label", value);

      if (!this.get("slug")) {
        changeset.set("slug", slugify(value));
      }
    }
  }
});
