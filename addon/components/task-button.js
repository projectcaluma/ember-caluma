import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency-decorators";

import allWorkItems from "ember-caluma/gql/queries/all-work-items.graphql";

/**
 * Component to render TaskButton which mutates the work item through the task slug and filters.
 *
 * ```hbs
 * <TaskButton @mutation="complete" @taskSlug="" filters=""/>
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
   * @argument {String} taskSlug
   */
  /**
   * The filters to find the work item which should be mutated.
   * @argument {Array} filters
   */

  @queryManager apollo;

  @service notification;
  @service intl;

  @dropTask
  *fetchWorkItem() {
    try {
      return yield this.apollo.query({
        query: allWorkItems,
        variables: {
          filter: [{ taskSlug: this.args.taskSlug }, ...this.args.filters],
        },
      });
    } catch (e) {
      if (this.args.onError) {
        this.args.onError(e);
      } else {
        // eslint-disable-next-line no-console
        console.error(e);
        this.notification.danger(this.intl.t("caluma.task-button.error"));
      }
    }
  }
}
