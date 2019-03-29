import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { get } from "@ember/object";
import { RouteQueryManager } from "ember-apollo-client";
import gql from "graphql-tag";
import { atob } from "ember-caluma/helpers/atob";
import DummyComponent from "../components/dummy";

export default Route.extend(RouteQueryManager, {
  apollo: service(),

  intl: service(),
  options: service(),

  init() {
    this._super(...arguments);

    this.intl.setLocale([...navigator.languages, "en-us"]);

    this.options.set("overrides", {
      "foo-test-1": DummyComponent
    });
  },

  async model() {
    const res = await this.apollo.watchQuery(
      {
        query: gql`
          query {
            allDocuments {
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

    return atob(get(res, "firstObject.node.id"));
  }
});
