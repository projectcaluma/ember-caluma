import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { restartableTask, dropTask } from "ember-concurrency";
import { trackedTask } from "reactiveweb/ember-concurrency";

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

  get data() {
    return this._data.value?.[0]?.node;
  }

  _data = trackedTask(this, this.fetchData, () => [this.args.slug]);

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
      "allForms.edges",
    );
  }

  get prefix() {
    return this.calumaOptions.namespace
      ? `${this.calumaOptions.namespace}-`
      : "";
  }

  @dropTask
  *submit(changeset) {
    const rawMeta = changeset.get("meta");

    try {
      const form = yield this.apollo.mutate(
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
  }

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
