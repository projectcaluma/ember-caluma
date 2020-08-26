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

  title: reads("fetchLabel.lastSuccessful.value.firstObject.node.label"),
  fetchLabel: task(function* (slug) {
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
  }),

  beforeModel() {
    const { question_slug: slug } = this.paramsFor(this.routeName);

    return this.fetchLabel.perform(slug);
  },

  model({ question_slug }) {
    return {
      questionSlug: question_slug,
      formSlug: this.modelFor("edit"),
    };
  },
});
