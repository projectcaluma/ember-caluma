import { getOwner } from "@ember/application";
import { A } from "@ember/array";
import Component from "@ember/component";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import { queryManager } from "ember-apollo-client";
import { optional } from "ember-composable-helpers/helpers/optional";
import { task, timeout } from "ember-concurrency";
import { v4 } from "uuid";

import layout from "../../templates/components/cfb-form-editor/general";
import validations from "../../validations/form";

import saveFormMutation from "ember-caluma/gql/mutations/save-form.graphql";
import checkFormSlugQuery from "ember-caluma/gql/queries/check-form-slug.graphql";
import formEditorGeneralQuery from "ember-caluma/gql/queries/form-editor-general.graphql";
import slugify from "ember-caluma/utils/slugify";

export default Component.extend({
  layout,
  validations,

  notification: service(),
  intl: service(),
  calumaOptions: service(),

  apollo: queryManager(),

  didReceiveAttrs() {
    this._super();
    this.data.perform();
  },

  data: task(function* () {
    if (!this.slug) {
      return A([
        {
          node: {
            name: "",
            slug: "",
            description: "",
            isPublished: true,
          },
        },
      ]);
    }

    return yield this.apollo.watchQuery(
      {
        query: formEditorGeneralQuery,
        variables: { slug: this.slug },
        fetchPolicy: "cache-and-network",
      },
      "allForms.edges"
    );
  }).restartable(),

  prefix: computed("calumaOptions.namespace", function () {
    return this.calumaOptions.namespace
      ? `${this.calumaOptions.namespace}-`
      : "";
  }),

  submit: task(function* (changeset) {
    try {
      const slug = ((!this.slug && this.prefix) || "") + changeset.get("slug");

      const form = yield this.apollo.mutate(
        {
          mutation: saveFormMutation,
          variables: {
            input: {
              name: changeset.get("name"),
              slug,
              description: changeset.get("description"),
              isArchived: changeset.get("isArchived"),
              isPublished: changeset.get("isPublished"),
              clientMutationId: v4(),
            },
          },
        },
        "saveForm.form"
      );

      this.notification.success(
        this.intl.t(
          `caluma.form-builder.notification.form.${
            this.slug ? "save" : "create"
          }.success`
        )
      );

      optional([this.get("on-after-submit")])(form);
    } catch (e) {
      this.notification.danger(
        this.intl.t(
          `caluma.form-builder.notification.form.${
            this.slug ? "save" : "create"
          }.error`
        )
      );
    }
  }).drop(),

  validateSlug: task(function* (slug, changeset) {
    /* istanbul ignore next */
    if (
      getOwner(this).resolveRegistration("config:environment").environment !==
      "test"
    ) {
      yield timeout(500);
    }

    const res = yield this.apollo.query(
      {
        query: checkFormSlugQuery,
        variables: { slug },
      },
      "allForms.edges"
    );

    if (res && res.length) {
      changeset.pushErrors(
        "slug",
        this.intl.t("caluma.form-builder.validations.form.slug")
      );
    }
  }).restartable(),

  actions: {
    updateName(value, changeset) {
      changeset.set("name", value);

      if (!this.slug) {
        const slug = slugify(value, { locale: this.intl.primaryLocale });
        changeset.set("slug", slug);

        this.validateSlug.perform(this.prefix + slug, changeset);
      }
    },

    updateSlug(value, changeset) {
      changeset.set("slug", value);

      this.validateSlug.perform(this.prefix + value, changeset);
    },
  },
});
