import { getOwner } from "@ember/application";
import Service, { inject as service } from "@ember/service";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency";
import { useTask } from "ember-resources";

import config from "@projectcaluma/ember-distribution/config";
import controlWorkItemsQuery from "@projectcaluma/ember-distribution/gql/queries/control-work-items.graphql";

export default class CalumaDistributionControlsService extends Service {
  @service calumaOptions;
  @service router;

  @queryManager apollo;

  @config config;

  get caseId() {
    return getOwner(this).lookup("route:application").currentModel;
  }

  workItems = useTask(this, this.fetchWorkItems, () => [this.caseId]);

  @dropTask
  *fetchWorkItems(caseId) {
    return yield this.apollo.watchQuery({
      query: controlWorkItemsQuery,
      variables: {
        caseId,
        currentGroup: String(this.calumaOptions.currentGroupId),
        createTask: this.config.controls.createTask,
        completeTask: this.config.controls.completeTask,
        inquiryTask: this.config.inquiry.task,
      },
    });
  }
}
