import { getOwner } from "@ember/application";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { timeout, restartableTask, dropTask } from "ember-concurrency";
import { useTask } from "ember-resources";

import FormValidations from "../../validations/form";

import slugify from "@projectcaluma/ember-core/utils/slugify";
import saveFormMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-form.graphql";
import checkFormSlugQuery from "@projectcaluma/ember-form-builder/gql/queries/check-form-slug.graphql";
import formEditorGeneralQuery from "@projectcaluma/ember-form-builder/gql/queries/form-editor-general.graphql";

export default class CfbFormEditorGeneral extends Component {
  @service notification;
  @service intl;
  @service calumaOptions;
  @queryManager apollo;

  Validations = FormValidations;

  get data() {
    return this._data.value?.[0]?.node;
  }

  _data = useTask(this, this.fetchData, () => [this.args.slug]);

  @restartableTask
  *fetchData() {
    if (!this.args.slug) {
      return [
        {
          node: {
            name: "",
            slug: "",
            description: "",
            isPublished: true,
          },
        },
      ];
    }

    return yield this.apollo.watchQuery(
      {
        query: formEditorGeneralQuery,
        variables: { slug: this.args.slug },
        fetchPolicy: "cache-and-network",
      },
      "allForms.edges"
    );
  }

  get prefix() {
    return this.calumaOptions.namespace
      ? `${this.calumaOptions.namespace}-`
      : "";
  }

  @dropTask
  *submit(changeset) {
    try {
      const slug =
        ((!this.args.slug && this.prefix) || "") + changeset.get("slug");

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
            },
          },
        },
        "saveForm.form"
      );

      this.notification.success(
        this.intl.t(
          `caluma.form-builder.notification.form.${
            this.args.slug ? "save" : "create"
          }.success`
        )
      );

      this.args.onAfterSubmit?.(form);
    } catch (e) {
      this.notification.danger(
        this.intl.t(
          `caluma.form-builder.notification.form.${
            this.args.slug ? "save" : "create"
          }.error`
        )
      );
    }
  }

  @restartableTask
  *validateSlug(slug, changeset) {
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
  }

  @action
  updateName(value, changeset) {
    changeset.set("name", value);

    if (!this.args.slug) {
      const slug = slugify(value, { locale: this.intl.primaryLocale });
      changeset.set("slug", slug);

      this.validateSlug.perform(this.prefix + slug, changeset);
    }
  }

  @action
  updateSlug(value, changeset) {
    changeset.set("slug", value);

    this.validateSlug.perform(this.prefix + value, changeset);
  }
}
