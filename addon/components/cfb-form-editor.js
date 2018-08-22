import Component from "@ember/component";
import layout from "../templates/components/cfb-form-editor";
import { task } from "ember-concurrency";
import gql from "graphql-tag";
import { ComponentQueryManager } from "ember-apollo-client";

const query = gql`
  query Form($id: ID!) {
    node(id: $id) {
      ... on Form {
        id
        name
        questions {
          edges {
            node {
              id
              slug
              label
              type
            }
          }
        }
      }
    }
  }
`;

export default Component.extend(ComponentQueryManager, {
  layout,

  init() {
    this._super(...arguments);

    this.get("data").perform();
  },

  data: task(function*() {
    if (!this.get("slug")) {
      return null;
    }

    return yield this.get("apollo").watchQuery(
      {
        query,
        variables: { id: btoa(`Form:${this.get("slug")}`) },
        fetchPolicy: "cache-and-network"
      },
      "node"
    );
  }).restartable()
});
