import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import NavigationRouteMixin from "ember-caluma-form-builder/mixins/navigation-route";
import { task } from "ember-concurrency";
import gql from "graphql-tag";
import { RouteQueryManager } from "ember-apollo-client";
import { reads } from "@ember/object/computed";

export default Route.extend(NavigationRouteMixin, RouteQueryManager, {
  intl: service(),

  title: reads("fetchName.lastSuccessful.value.node.name"),
  fetchName: task(function*(slug) {
    return yield this.get("apollo").watchQuery({
      query: gql`
        query FormName($id: ID!) {
          node(id: $id) {
            ... on Form {
              name
            }
          }
        }
      `,
      variables: {
        id: btoa(`Form:${slug}`)
      }
    });
  }),

  beforeModel() {
    const { form_slug: slug } = this.paramsFor(this.get("routeName"));

    return this.get("fetchName").perform(slug);
  },

  model: ({ form_slug }) => form_slug
});
