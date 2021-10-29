import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { restartableTask } from "ember-concurrency-decorators";
import { useTask } from "ember-resources";

import config from "@projectcaluma/ember-distribution/config";
import getAllInquiriesQuery from "@projectcaluma/ember-distribution/gql/queries/all-inquiries.graphql";
import uniqueByGroups from "@projectcaluma/ember-distribution/utils/unique-by-groups";

export default class DistributionNavigationComponent extends Component {
  @service calumaOptions;
  @service("-scheduler") scheduler;

  @config config;

  @queryManager apollo;

  inquiries = useTask(this, this.fetchInquiries, () => [
    this.args.caseId,
    this.config,
  ]);

  @restartableTask
  *fetchInquiries() {
    const response = yield this.apollo.query({
      query: getAllInquiriesQuery,
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

    const groups = yield this.scheduler.resolve(groupIds, "group");
    const findGroupName = (ids) =>
      groups.find((g) =>
        ids.includes(g[this.calumaOptions.groupIdentifierProperty])
      )?.[this.calumaOptions.groupNameProperty];

    return Object.entries(response).reduce((inquiries, [key, objects]) => {
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
    }, {});
  }
}
