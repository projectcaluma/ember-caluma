import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { lastValue, dropTask } from "ember-concurrency-decorators";

import allWorkItems from "ember-caluma/gql/queries/all-work-items.graphql";

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

  @lastValue("fetchWorkItem") workItem;

  @dropTask
  *fetchWorkItem() {
    try {
      const response = yield this.apollo.query(
        {
          query: allWorkItems,
          variables: {
            filter: [
              { task: this.args.task },
              { status: "READY" },
              ...(this.args.filters || []),
            ],
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
