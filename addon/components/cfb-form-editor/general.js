import Component from "@ember/component";
import { inject as service } from "@ember/service";
import layout from "../../templates/components/cfb-form-editor/general";
import { task, timeout } from "ember-concurrency";
import { ComponentQueryManager } from "ember-apollo-client";
import validations from "../../validations/form";
import v4 from "uuid/v4";
import slugify from "ember-caluma-form-builder/utils/slugify";
import { optional } from "ember-composable-helpers/helpers/optional";
import { A } from "@ember/array";

import checkFormSlugQuery from "ember-caluma-form-builder/gql/queries/check-form-slug";
import formEditorGeneralQuery from "ember-caluma-form-builder/gql/queries/form-editor-general";
import saveFormMutation from "ember-caluma-form-builder/gql/mutations/save-form";
import archiveFormMutation from "ember-caluma-form-builder/gql/mutations/archive-form";

export default Component.extend(ComponentQueryManager, {
  layout,
  validations,

  notification: service(),
  intl: service(),

  didReceiveAttrs() {
    this._super(...arguments);

    this.get("data").perform();
  },

  data: task(function*() {
    if (!this.get("slug")) {
      return A([
        {
          node: {
            name: "",
            slug: "",
            description: ""
          }
        }
      ]);
    }

    return yield this.get("apollo").watchQuery(
      {
        query: formEditorGeneralQuery,
        variables: { slug: this.get("slug") },
        fetchPolicy: "cache-and-network"
      },
      "allForms.edges"
    );
  }).restartable(),

  submit: task(function*(changeset) {
    try {
      const form = yield this.get("apollo").mutate(
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

  archive: task(function*(changeset) {
    try {
      const form = yield this.get("apollo").mutate(
        {
          mutation: archiveFormMutation,
          variables: {
            input: {
              id: changeset.get("slug"),
              clientMutationId: v4()
            }
          }
        },
        "archiveForm.form"
      );

      this.get("notification").success(
        this.get("intl").t(
          "caluma.form-builder.notification.form.archive.success"
        )
      );

      optional([this.get("on-after-archive")])(form);
    } catch (e) {
      this.get("notification").danger(
        this.get("intl").t(
          "caluma.form-builder.notification.form.archive.error"
        )
      );
    }
  }).drop(),

  validateSlug: task(function*(slug, changeset) {
    yield timeout(500);

    const res = yield this.get("apollo").query(
      {
        query: checkFormSlugQuery,
        variables: { slug }
      },
      "allForms.edges"
    );

    if (res && res.length) {
      changeset.pushErrors(
        "slug",
        this.get("intl").t("caluma.form-builder.validations.form.slug")
      );
    }
  }).restartable(),

  actions: {
    updateName(value, changeset) {
      changeset.set("name", value);

      if (!this.get("slug")) {
        const slug = slugify(value);
        changeset.set("slug", slug);
        this.get("validateSlug").perform(slug, changeset);
      }
    },

    updateSlug(value, changeset) {
      changeset.set("slug", value);

      this.get("validateSlug").perform(value, changeset);
    }
  }
});
