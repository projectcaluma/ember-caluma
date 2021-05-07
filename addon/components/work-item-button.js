import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { restartableTask } from "ember-concurrency-decorators";

import cancelWorkItem from "ember-caluma/gql/mutations/cancel-work-item.graphql";
import completeWorkItem from "ember-caluma/gql/mutations/complete-work-item.graphql";
import skipWorkItem from "ember-caluma/gql/mutations/skip-work-item.graphql";

export default class ComponentsWorkItemButtonComponent extends Component {
  @queryManager apollo;

  @service intl;

  constructor(owner, args) {
    super(owner, args);

    this.cancelWorkItem = cancelWorkItem;
    this.completeWorkItem = completeWorkItem;
    this.skipWorkItem = skipWorkItem;
  }

  @restartableTask
  *mutate() {
    yield this.apollo.mutate({
      mutation: this[`${this.args.mutation}WorkItem`],
      variables: { id: this.args.workItemId },
    });
  }
}
