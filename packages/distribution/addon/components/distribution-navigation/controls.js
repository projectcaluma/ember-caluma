import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency";
import { useTask } from "ember-resources";

import config from "@projectcaluma/ember-distribution/config";
import controlWorkItemsQuery from "@projectcaluma/ember-distribution/gql/queries/control-work-items.graphql";

export default class DistributionNavigationControlsComponent extends Component {
  @service calumaOptions;

  @queryManager apollo;

  @config config;

  workItems = useTask(this, this.fetchWorkItems, () => []);

  get canCreate() {
    return this.workItems.value?.create.edges.length > 0;
  }

  get canComplete() {
    return this.workItems.value?.complete.edges.length > 0;
  }

  @action
  noop(e) {
    e.preventDefault();
  }

  @dropTask
  *fetchWorkItems() {
    return yield this.apollo.watchQuery({
      query: controlWorkItemsQuery,
      variables: {
        caseId: this.args.caseId,
        currentGroup: String(this.calumaOptions.currentGroupId),
        createTask: this.config.controls.createTask,
        completeTask: this.config.controls.completeTask,
      },
    });
  }
}
