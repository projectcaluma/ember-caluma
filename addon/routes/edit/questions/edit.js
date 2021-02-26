import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import gql from "graphql-tag";

import NavigationRouteMixin from "ember-caluma/mixins/navigation-route";

export default class EditQuestionsEditRoute extends Route.extend(
  NavigationRouteMixin
) {
  @service intl;
  @queryManager apollo;

  get title() {
    return this.fetchLabel.lastSuccessful?.value?.firstObject?.node.label;
  }

  @task
  *fetchLabel(slug) {
    return yield this.apollo.watchQuery(
      {
        query: gql`
          query QuestionLabel($slug: String!) {
            allQuestions(slug: $slug) {
              edges {
                node {
                  label
                }
              }
            }
          }
        `,
        variables: { slug },
      },
      "allQuestions.edges"
    );
  }

  beforeModel() {
    const { question_slug: slug } = this.paramsFor(this.routeName);

    return this.fetchLabel.perform(slug);
  }

  model({ question_slug }) {
    return {
      questionSlug: question_slug,
      formSlug: this.modelFor("edit"),
    };
  }
}
