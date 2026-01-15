import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import { gql } from "graphql-tag";

import { navigationTitle } from "@projectcaluma/ember-form-builder/decorators";

export default class EditRoute extends Route {
  @service intl;
  @queryManager apollo;

  @navigationTitle
  get title() {
    return this.fetchName.lastSuccessful?.value;
  }

  fetchName = task({ drop: true }, async (slug) => {
    const [form] = await this.apollo.query(
      {
        query: gql`
          query FormName($slug: String!) {
            allForms(filter: [{ slugs: [$slug] }]) {
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
      "allForms.edges",
    );

    return form?.node.name;
  });

  beforeModel() {
    const { form_slug: slug } = this.paramsFor(this.routeName);

    return this.fetchName.perform(slug);
  }

  model({ form_slug: slug }) {
    return slug;
  }
}
