import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency";
import gql from "graphql-tag";

const query = gql`
  query Forms {
    allForms {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }
`;

export default Controller.extend({
  apollo: service(),

  setup() {
    this.data.perform();
  },

  data: task(function*() {
    return yield this.apollo.watchQuery(
      { query, variables: {} },
      "allForms.edges"
    );
  }),

  actions: {
    edit(id) {
      this.transitionToRoute("edit", id);
    }
  }
});
