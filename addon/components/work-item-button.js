import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency-decorators";

import cancelWorkItem from "ember-caluma/gql/mutations/cancel-work-item.graphql";
import completeWorkItem from "ember-caluma/gql/mutations/complete-work-item.graphql";
import skipWorkItem from "ember-caluma/gql/mutations/skip-work-item.graphql";

/**
 * Component to render a UkButton which mutates the given work item.
 *
 * ```hbs
 * <WorkItemButton @mutation="complete" @workItemId=""/>
 * ```
 *
 * @class WorkItemButtonComponent
 */
export default class WorkItemButtonComponent extends Component {
  /**
   * The mutation which is going to be used for the work item.
   * Valid mutations are: complete, skip, cancel
   * @argument {String} mutation
   */
  /**
   * The id of the work item
   * @argument {String} workItemId
   */

  @queryManager apollo;

  @service notification;
  @service intl;

  cancelWorkItemMutation = cancelWorkItem;
  completeWorkItemMutation = completeWorkItem;
  skipWorkItemMutation = skipWorkItem;

  @dropTask
  *mutate() {
    try {
      if (typeof this.args.beforeMutate === "function") {
        const proceed = yield this.args.beforeMutate();

        if (proceed === false) return;
      }

      yield this.apollo.mutate({
        mutation: this[`${this.args.mutation}WorkItemMutation`],
        variables: { id: this.args.workItemId },
      });

      if (typeof this.args.onSuccess === "function") {
        yield this.args.onSuccess();
      } else {
        this.notification.success(
          this.intl.t("caluma.mutate-work-item.success")
        );
      }
    } catch (e) {
      if (typeof this.args.onError === "function") {
        yield this.args.onError(e);
      } else {
        // eslint-disable-next-line no-console
        console.error(e);
        this.notification.danger(this.intl.t("caluma.mutate-work-item.error"));
      }
    }
  }
}
