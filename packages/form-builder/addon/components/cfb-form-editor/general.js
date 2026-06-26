import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import { trackedFunction } from "reactiveweb/function";

import FormValidations from "../../validations/form";

import slugify from "@projectcaluma/ember-core/utils/slugify";
import saveFormMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-form.graphql";
import formEditorGeneralQuery from "@projectcaluma/ember-form-builder/gql/queries/form-editor-general.graphql";

export default class CfbFormEditorGeneral extends Component {
  @service notification;
  @service intl;
  @service calumaOptions;
  @queryManager apollo;

  Validations = FormValidations;

  get dataIsLoaded() {
    // watchQuery returns an empty TrackedObject which is truthy
    // so we need to check if the slug property exists in the object
    return this.data.value && "slug" in this.data.value;
  }

  data = trackedFunction(this, async () => {
    if (!this.args.slug) {
      return {
        name: "",
        slug: "",
        description: "",
        isPublished: true,
      };
    }

    return await this.apollo.watchQuery(
      {
        query: formEditorGeneralQuery,
        variables: { slug: this.args.slug },
        fetchPolicy: "cache-and-network",
      },
      "allForms.edges.0.node",
    );
  });

  get prefix() {
    return this.calumaOptions.namespace
      ? `${this.calumaOptions.namespace}-`
      : "";
  }

  submit = task({ drop: true }, async (changeset) => {
    const rawMeta = changeset.get("meta");

    try {
      const form = await this.apollo.mutate(
        {
          mutation: saveFormMutation,
          variables: {
            input: {
              name: changeset.get("name"),
              slug: changeset.get("slug"),
              description: changeset.get("description"),
              isArchived: changeset.get("isArchived"),
              isPublished: changeset.get("isPublished"),
              meta: JSON.stringify(rawMeta?.unwrap?.() ?? rawMeta),
            },
          },
        },
        "saveForm.form",
      );

      this.notification.success(
        this.intl.t(
          `caluma.form-builder.notification.form.${
            this.args.slug ? "save" : "create"
          }.success`,
        ),
      );

      this.args.onAfterSubmit?.(form);
    } catch {
      this.notification.danger(
        this.intl.t(
          `caluma.form-builder.notification.form.${
            this.args.slug ? "save" : "create"
          }.error`,
        ),
      );
    }
  });

  @action
  updateName(value, changeset) {
    changeset.set("name", value);

    if (!this.args.slug && !this.slugUnlinked) {
      const slugifiedName = slugify(value, { locale: this.intl.primaryLocale });
      const slug = slugifiedName ? this.prefix + slugifiedName : "";

      changeset.set("slug", slug);
    }
  }
}
