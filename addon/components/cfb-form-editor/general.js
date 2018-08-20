import Component from "@ember/component";
import { inject as service } from "@ember/service";
import layout from "../../templates/components/cfb-form-editor/general";
import { task } from "ember-concurrency";
import gql from "graphql-tag";
import { ComponentQueryManager } from "ember-apollo-client";
import validations from "../../validations/form";
import v4 from "uuid/v4";
import slug from "slug";

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
        query: gql`
          query FormGeneral($id: ID!) {
            node(id: $id) {
              ... on Form {
                id
                name
                slug
                description
              }
            }
          }
        `,
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
          mutation: gql`
            mutation SaveForm($input: SaveFormInput!) {
              saveForm(input: $input) {
                form {
                  id
                  name
                  slug
                  description
                }
                clientMutationId
              }
            }
          `,
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

      this.getWithDefault("on-after-submit", () => {})(form);
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
      if (!this.get("slug")) {
        return;
      }

      yield this.get("apollo").mutate({
        mutation: gql`
          mutation DeleteForm($input: DeleteFormInput!) {
            deleteForm(input: $input) {
              clientMutationId
            }
          }
        `,
        variables: {
          input: {
            formId: changeset.get("id"),
            clientMutationId: v4()
          }
        }
      });

      this.get("notification").success(
        this.get("intl").t(
          "caluma.form-builder.notification.form.delete.success"
        )
      );

      this.getWithDefault("on-after-delete", () => {})();
    } catch (e) {
      this.get("notification").danger(
        this.get("intl").t("caluma.form-builder.notification.form.delete.error")
      );
    }
  }).drop(),

  actions: {
    inputName(changeset, value) {
      if (!this.get("slug")) {
        changeset.set(
          "slug",
          slug(value)
            .toLowerCase()
            .substr(0, 50)
        );
      }
    }
  }
});
