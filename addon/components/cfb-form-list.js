import Component from "@ember/component";
import layout from "../templates/components/cfb-form-list";
import { task } from "ember-concurrency";
import { queryManager } from "ember-apollo-client";
import formListQuery from "ember-caluma/gql/queries/form-list";

export default Component.extend({
  layout,

  apollo: queryManager(),

  didReceiveAttrs() {
    this._super(...arguments);

    this.data.perform();
  },

  data: task(function* () {
    return yield this.apollo.watchQuery(
      {
        query: formListQuery,
        fetchPolicy: "cache-and-network",
      },
      "allForms.edges"
    );
  }).restartable(),
});
