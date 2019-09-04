import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import NavigationRouteMixin from "ember-caluma/mixins/navigation-route";
import { task } from "ember-concurrency";
import gql from "graphql-tag";
import { queryManager } from "ember-apollo-client";
import { reads } from "@ember/object/computed";

export default Route.extend(NavigationRouteMixin, {
  intl: service(),

  apollo: queryManager(),

  title: reads("fetchName.lastSuccessful.value.firstObject.node.name"),
  fetchName: task(function*(slug) {
    return yield this.get("apollo").watchQuery(
      {
        query: gql`
          query FormName($slug: String!) {
            allForms(slug: $slug) {
              edges {
                node {
                  name
                }
              }
            }
          }
        `,
        variables: { slug }
      },
      "allForms.edges"
    );
  }),

  beforeModel() {
    const { form_slug: slug } = this.paramsFor(this.get("routeName"));

    return this.get("fetchName").perform(slug);
  },

  model: ({ form_slug }) => form_slug
});
