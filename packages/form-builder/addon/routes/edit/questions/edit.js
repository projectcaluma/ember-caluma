import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { queryManager } from "ember-apollo-client";
import { lastValue, dropTask } from "ember-concurrency";
import { gql } from "graphql-tag";

import { navigationTitle } from "@projectcaluma/ember-form-builder/decorators";

export default class EditQuestionsEditRoute extends Route {
  @service intl;
  @queryManager apollo;

  @navigationTitle
  @lastValue("fetchLabel")
  title;

  @dropTask
  *fetchLabel(slug) {
    const [question] = yield this.apollo.query(
      {
        query: gql`
          query QuestionLabel($slug: String!) {
            allQuestions(filter: [{ slugs: [$slug] }]) {
              edges {
                node {
                  id
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

    return question?.node.label;
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
