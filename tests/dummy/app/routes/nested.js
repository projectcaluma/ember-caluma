import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { get } from "@ember/object";
import { RouteQueryManager } from "ember-apollo-client";
import gql from "graphql-tag";
import { decodeId } from "ember-caluma/helpers/decode-id";

export default Route.extend(RouteQueryManager, {
  apollo: service(),

  intl: service(),

  init() {
    this._super(...arguments);

    this.intl.setLocale([...navigator.languages, "en-us"]);
  },

  async model() {
    const res = await this.apollo.watchQuery(
      {
        query: gql`
          query AllDocsToFindFirst {
            allDocuments(form: "main") {
              edges {
                node {
                  id
                }
              }
            }
          }
        `
      },
      "allDocuments.edges"
    );

    return decodeId(get(res, "firstObject.node.id"));
  }
});
