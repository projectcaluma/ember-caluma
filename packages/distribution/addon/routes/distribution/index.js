import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { queryManager } from "ember-apollo-client";

import config from "@projectcaluma/ember-distribution/config";
import inquiryNavigationQuery from "@projectcaluma/ember-distribution/gql/queries/inquiry-navigation.graphql";
import uniqueByGroups from "@projectcaluma/ember-distribution/utils/unique-by-groups";

export default class DistributionIndexRoute extends Route {
  @service router;
  @service calumaOptions;

  @config config;

  @queryManager apollo;

  async redirect(model) {
    const response = await this.apollo.query({
      query: inquiryNavigationQuery,
      variables: {
        caseId: model,
        task: this.config.inquiry.task,
        currentGroup: String(this.calumaOptions.currentGroupId),
        includeNavigationData: false,
      },
    });

    const models = Object.entries(response).flatMap(([, objects]) => {
      return uniqueByGroups(objects.edges.map((edge) => edge.node)).map(
        (inquiry) => ({
          from: inquiry.controllingGroups[0],
          to: inquiry.addressedGroups[0],
        })
      );
    }, {});

    if (models.length) {
      return this.router.replaceWith("distribution.inquiry", models[0]);
    }
  }
}
