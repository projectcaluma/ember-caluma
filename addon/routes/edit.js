import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import gql from "graphql-tag";

import NavigationRouteMixin from "ember-caluma/mixins/navigation-route";

export default class EditRoute extends Route.extend(NavigationRouteMixin) {
  @service intl;
  @queryManager apollo;

  get title() {
    return this.fetchName.lastSuccessful?.value?.firstObject?.node.name;
  }

  @task
  *fetchName(slug) {
    return yield this.apollo.watchQuery(
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
        variables: { slug },
      },
      "allForms.edges"
    );
  }

  beforeModel() {
    const { form_slug: slug } = this.paramsFor(this.routeName);

    return this.fetchName.perform(slug);
  }

  model({ form_slug: slug }) {
    return slug;
  }
}
