import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { queryManager } from "ember-apollo-client";
import { lastValue, task } from "ember-concurrency";
import gql from "graphql-tag";

import { navigationTitle } from "ember-caluma/decorators";

export default class EditRoute extends Route {
  @service intl;
  @queryManager apollo;

  @navigationTitle
  @lastValue("fetchName")
  title;

  @task
  *fetchName(slug) {
    const [form] = yield this.apollo.watchQuery(
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

    return form?.node.name;
  }

  beforeModel() {
    const { form_slug: slug } = this.paramsFor(this.routeName);

    return this.fetchName.perform(slug);
  }

  model({ form_slug: slug }) {
    return slug;
  }
}
