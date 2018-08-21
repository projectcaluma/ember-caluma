import Component from "@ember/component";
import layout from "../templates/components/cfb-form-list";
import { task } from "ember-concurrency";
import gql from "graphql-tag";
import { ComponentQueryManager } from "ember-apollo-client";

const query = gql`
  query Forms {
    allForms {
      edges {
        node {
          id
          name
          description
          slug
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
    return yield this.get("apollo").watchQuery(
      {
        query,
        variables: {},
        fetchPolicy: "cache-and-network"
      },
      "allForms.edges"
    );
  }).restartable()
});
