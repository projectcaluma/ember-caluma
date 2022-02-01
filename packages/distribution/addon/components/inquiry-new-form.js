import { getOwner } from "@ember/application";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { timeout, restartableTask, dropTask, task } from "ember-concurrency";
import { useTask } from "ember-resources";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import config from "@projectcaluma/ember-distribution/config";
import createInquiryMutation from "@projectcaluma/ember-distribution/gql/mutations/create-inquiry.graphql";
import controlWorkItemsQuery from "@projectcaluma/ember-distribution/gql/queries/control-work-items.graphql";
import inquiryNavigationQuery from "@projectcaluma/ember-distribution/gql/queries/inquiry-navigation.graphql";

const toggle = (value, array) => {
  const set = new Set(array);

  set.delete(value) || set.add(value);

  return [...set];
};

export default class InquiryNewFormComponent extends Component {
  @service calumaOptions;
  @service notification;
  @service intl;
  @service router;

  @queryManager apollo;

  @config config;

  @tracked selectedGroups = [];

  groups = useTask(this, this.fetchGroups, () => [
    this.args.selectedTypes,
    this.args.search,
  ]);

  @action
  updateSelectedTypes(type, e) {
    e.preventDefault();

    this.args.onChangeSelectedTypes(toggle(type, this.args.selectedTypes));
  }

  @action
  updateSelectedGroups(identifier, e) {
    e.preventDefault();

    this.selectedGroups = toggle(identifier, this.selectedGroups);
  }

  @action
  clearSelectedGroups(e) {
    e.preventDefault();

    this.selectedGroups = [];
  }

  @restartableTask
  *updateSearch(e) {
    e.preventDefault();

    const { environment } =
      getOwner(this).resolveRegistration("config:environment");

    if (environment !== "test") {
      yield timeout(500);
    }

    this.args.onChangeSearch(e.target.value);
  }

  @dropTask
  *submit(e) {
    e.preventDefault();

    if (!this.selectedGroups.length) return;

    try {
      // get create inquiry work item to complete, this will not trigger a
      // network request since it's already fetch in the controls
      const controlsData = yield this.apollo.watchQuery(
        {
          query: controlWorkItemsQuery,
          variables: {
            caseId: this.args.caseId,
            currentGroup: String(this.calumaOptions.currentGroupId),
            createTask: this.config.controls.createTask,
            completeTask: this.config.controls.completeTask,
          },
        },
        "create.edges"
      );

      // create new inquiries
      yield this.apollo.mutate({
        mutation: createInquiryMutation,
        variables: {
          id: decodeId(controlsData[0].node.id),
          context: JSON.stringify({
            addressed_groups: this.selectedGroups.map(String),
          }),
        },
      });

      // refetch navigation data
      const navigationData = yield this.apollo.query(
        {
          query: inquiryNavigationQuery,
          fetchPolicy: "network-only",
          variables: {
            caseId: this.args.caseId,
            task: this.config.inquiry.task,
            currentGroup: String(this.calumaOptions.currentGroupId),
            statusQuestion: this.config.inquiry.answer.statusQuestion,
            deadlineQuestion: this.config.inquiry.deadlineQuestion,
            includeNavigationData: true,
          },
        },
        "controlling.edges"
      );

      // transition to last added inquiry
      this.router.transitionTo("distribution.inquiry", {
        from: navigationData[0].node.controllingGroups[0],
        to: navigationData[0].node.addressedGroups[0],
      });
    } catch (e) {
      this.notification.danger(
        this.intl.t("caluma.distribution.new.error", {
          count: this.selectedGroups.length,
        })
      );
    }
  }

  @task
  *fetchGroups(types, search) {
    // https://github.com/ember-cli/eslint-plugin-ember/issues/1413
    yield Promise.resolve();

    const typedGroups = yield this.calumaOptions.fetchTypedGroups(
      types,
      search
    );

    return Object.entries(typedGroups)
      .flatMap(([type, groups]) => {
        return groups.map((group) => ({
          identifier: group[this.calumaOptions.groupIdentifierProperty],
          name: group[this.calumaOptions.groupNameProperty],
          config: this.config.new.types[type],
        }));
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
