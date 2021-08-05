import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { queryManager } from "ember-apollo-client";
import { lastValue, dropTask } from "ember-concurrency-decorators";
import gql from "graphql-tag";

import { navigationTitle } from "@projectcaluma/ember-form-builder/decorators";

export default class EditRoute extends Route {
  @service intl;
  @queryManager apollo;

  @navigationTitle
  @lastValue("fetchName")
  title;

  @dropTask
  *fetchName(slug) {
    const [form] = yield this.apollo.query(
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
