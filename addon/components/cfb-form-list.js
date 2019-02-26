import Component from "@ember/component";
import layout from "../templates/components/cfb-form-list";
import { task } from "ember-concurrency";
import { ComponentQueryManager } from "ember-apollo-client";
import formListQuery from "ember-caluma/gql/queries/form-list";

export default Component.extend(ComponentQueryManager, {
  layout,

  didReceiveAttrs() {
    this._super(...arguments);

    this.get("data").perform();
  },

  data: task(function*() {
    return yield this.get("apollo").watchQuery(
      {
        query: formListQuery,
        variables: {},
        fetchPolicy: "cache-and-network"
      },
      "allForms.edges"
    );
  }).restartable()
});
