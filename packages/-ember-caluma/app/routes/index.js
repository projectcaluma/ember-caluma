import Route from "@ember/routing/route";
import { queryManager } from "ember-apollo-client";
import gql from "graphql-tag";

import { decodeId } from "ember-caluma/helpers/decode-id";

export default class IndexRoute extends Route {
  @queryManager apollo;

  async model() {
    const response = await this.apollo.query(
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

    return decodeId(response[0]?.node.id);
  }
}
