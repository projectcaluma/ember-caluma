import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { restartableTask } from "ember-concurrency-decorators";
import { useTask } from "ember-resources";

import config from "@projectcaluma/ember-distribution/config";
import inquiryNavigationQuery from "@projectcaluma/ember-distribution/gql/queries/inquiry-navigation.graphql";
import uniqueByGroups from "@projectcaluma/ember-distribution/utils/unique-by-groups";

export default class DistributionNavigationComponent extends Component {
  @service calumaOptions;
  @service("-scheduler") scheduler;

  @config config;

  @queryManager apollo;

  @tracked groups = [];

  get inquiries() {
    const findGroupName = (ids) =>
      this.groups.find((g) =>
        ids.includes(g[this.calumaOptions.groupIdentifierProperty])
      )?.[this.calumaOptions.groupNameProperty];

    return Object.entries(this._inquiries.value || []).reduce(
      (inquiries, [key, objects]) => {
        return {
          ...inquiries,
          [key]: uniqueByGroups(
            objects.edges.map((edge) => ({
              ...edge.node,
              addressedGroupName: findGroupName(edge.node.addressedGroups),
              controllingGroupName: findGroupName(edge.node.controllingGroups),
            }))
          ),
        };
      },
      {}
    );
  }

  _inquiries = useTask(this, this.fetchInquiries, () => [
    this.args.caseId,
    this.config,
  ]);

  @restartableTask
  *fetchInquiries() {
    const response = yield this.apollo.watchQuery({
      query: inquiryNavigationQuery,
      variables: {
        caseId: this.args.caseId,
        task: this.config.inquiry.task,
        currentGroup: String(this.calumaOptions.currentGroupId),
        statusQuestion: this.config.inquiry.answer.statusQuestion,
        deadlineQuestion: this.config.inquiry.deadlineQuestion,
        includeNavigationData: true,
      },
    });

    const groupIds = [
      ...new Set(
        Object.values(response)
          .map((inquiries) => {
            return inquiries.edges.map((edge) => [
              ...edge.node.addressedGroups,
              ...edge.node.controllingGroups,
            ]);
          })
          .flat(2)
      ),
    ];

    this.groups = yield this.scheduler.resolve(groupIds, "group");

    return response;
  }
}
