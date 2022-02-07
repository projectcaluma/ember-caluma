import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency";
import { useTask } from "ember-resources";

import allWorkItems from "@projectcaluma/ember-workflow/gql/queries/all-work-items.graphql";

/**
 * Component to render TaskButton which mutates the work item through the task slug and filters.
 *
 * ```hbs
 * <TaskButton @mutation="complete" @task="some-task" filters=(Optional)/>
 * ```
 *
 * @class TaskButtonComponent
 */
export default class TaskButtonComponent extends Component {
  /**
   * The mutation which is going to be used for the work item.
   * Valid mutations are: complete, skip, cancel
   * @argument {String} mutation
   */
  /**
   * The task slug of the work item which should be mutated.
   * @argument {String} task
   */
  /**
   * The filters to find the work item which should be mutated.
   * @argument {Array} filters
   */

  @queryManager apollo;

  @service notification;
  @service intl;

  workItem = useTask(this, this.fetchWorkItem, () => [
    this.args.task,
    this.args.filters,
  ]);

  @dropTask
  *fetchWorkItem(task, filters) {
    try {
      const response = yield this.apollo.query(
        {
          query: allWorkItems,
          fetchPolicy: "network-only",
          variables: {
            filter: [{ task }, { status: "READY" }, ...(filters ?? [])],
          },
        },
        "allWorkItems.edges"
      );

      return response[0]?.node;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      this.notification.danger(this.intl.t("caluma.task-button.error"));
    }
  }
}
