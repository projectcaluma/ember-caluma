import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { get } from "@ember/object";
import { queryManager } from "ember-apollo-client";
import gql from "graphql-tag";
import { decodeId } from "ember-caluma/helpers/decode-id";
import ENV from "ember-caluma/config/environment";

export default Route.extend({
  intl: service(),
  calumaOptions: service(),

  apollo: queryManager(),

  init() {
    this._super(...arguments);

    this.intl.setLocale("en");

    if (ENV.environment !== "production") {
      this.calumaOptions.registerComponentOverride({
        label: this.intl.t(
          "caluma.form-builder.question.widgetOverrides.dummy-one"
        ),
        component: "dummy-one",
        types: ["TextQuestion", "TextareaQuestion"],
      });

      this.calumaOptions.registerComponentOverride({
        label: this.intl.t(
          "caluma.form-builder.question.widgetOverrides.dummy-two"
        ),
        component: "dummy-two",
      });
    }
  },

  async model() {
    const res = await this.apollo.watchQuery(
      {
        query: gql`
          query {
            allDocuments(form: "main", orderBy: CREATED_AT_DESC) {
              edges {
                node {
                  id
                }
              }
            }
          }
        `,
      },
      "allDocuments.edges"
    );

    return decodeId(get(res, "firstObject.node.id"));
  },
});
