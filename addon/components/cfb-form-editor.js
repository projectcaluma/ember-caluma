import Component from "@ember/component";
import layout from "../templates/components/cfb-form-editor";
import { task } from "ember-concurrency";
import gql from "graphql-tag";
import { ComponentQueryManager } from "ember-apollo-client";

const query = gql`
  query FormName($id: ID!) {
    node(id: $id) {
      ... on Form {
        id
        name
        slug
      }
    }
  }
`;

export default Component.extend(ComponentQueryManager, {
  layout,

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
  }).on("init")
});
