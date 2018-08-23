import Component from "@ember/component";
import { inject as service } from "@ember/service";
import layout from "../../templates/components/cfb-form-editor/general";
import { task } from "ember-concurrency";
import { ComponentQueryManager } from "ember-apollo-client";
import validations from "../../validations/form";
import v4 from "uuid/v4";
import slugify from "slugify";
import { optional } from "ember-composable-helpers/helpers/optional";

import formEditorGeneralQuery from "ember-caluma-form-builder/gql/queries/form-editor-general";
import saveFormMutation from "ember-caluma-form-builder/gql/mutations/save-form";
import deleteFormMutation from "ember-caluma-form-builder/gql/mutations/delete-form";

export default Component.extend(ComponentQueryManager, {
  layout,
  validations,

  notification: service(),
  intl: service(),

  init() {
    this._super(...arguments);

    this.get("data").perform();
  },

  data: task(function*() {
    if (!this.get("slug")) {
      return {
        name: "",
        slug: "",
        description: ""
      };
    }

    return yield this.get("apollo").watchQuery(
      {
        query: formEditorGeneralQuery,
        variables: { id: btoa(`Form:${this.get("slug")}`) },
        fetchPolicy: "cache-and-network"
      },
      "node"
    );
  }).restartable(),

  submit: task(function*(changeset) {
    try {
      let form = yield this.get("apollo").mutate(
        {
          mutation: saveFormMutation,
          variables: {
            input: {
              name: changeset.get("name"),
              slug: changeset.get("slug"),
              description: changeset.get("description"),
              clientMutationId: v4()
            }
          }
        },
        "saveForm.form"
      );

      // Temporary fix for handling "errors":
      // https://github.com/projectcaluma/caluma/issues/18
      /* istanbul ignore next */
      if (!form) {
        throw new Error();
      }

      this.get("notification").success(
        this.get("intl").t(
          `caluma.form-builder.notification.form.${
            this.get("slug") ? "save" : "create"
          }.success`
        )
      );

      optional([this.get("on-after-submit")])(form);
    } catch (e) {
      this.get("notification").danger(
        this.get("intl").t(
          `caluma.form-builder.notification.form.${
            this.get("slug") ? "save" : "create"
          }.error`
        )
      );
    }
  }).drop(),

  delete: task(function*(changeset) {
    try {
      yield this.get("apollo").mutate({
        mutation: deleteFormMutation,
        variables: {
          input: {
            id: changeset.get("id"),
            clientMutationId: v4()
          }
        }
      });

      this.get("notification").success(
        this.get("intl").t(
          "caluma.form-builder.notification.form.delete.success"
        )
      );

      optional([this.get("on-after-delete")])();
    } catch (e) {
      this.get("notification").danger(
        this.get("intl").t("caluma.form-builder.notification.form.delete.error")
      );
    }
  }).drop(),

  actions: {
    inputName(changeset, value) {
      if (!this.get("slug")) {
        changeset.set("slug", slugify(value, { lower: true }).substr(0, 50));
      }
    }
  }
});
