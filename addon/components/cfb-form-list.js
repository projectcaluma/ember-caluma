import Component from "@ember/component";
import layout from "../templates/components/cfb-form-list";
import { task } from "ember-concurrency";
import gql from "graphql-tag";
import { ComponentQueryManager } from "ember-apollo-client";
import move from "ember-animated/motions/move";
import { fadeOut, fadeIn } from "ember-animated/motions/opacity";

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

  *transition({ keptSprites, removedSprites, insertedSprites }) {
    yield removedSprites.forEach(fadeOut);
    yield insertedSprites.forEach(fadeIn);
    yield keptSprites.forEach(move);
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
  })
    .restartable()
    .on("init")
});
