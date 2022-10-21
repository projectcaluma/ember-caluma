import Service, { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { queryManager, getObservable } from "ember-apollo-client";
import { dropTask } from "ember-concurrency";
import { trackedTask } from "ember-resources/util/ember-concurrency";
import { cached } from "tracked-toolbox";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import config from "@projectcaluma/ember-distribution/config";
import createInquiryMutation from "@projectcaluma/ember-distribution/gql/mutations/create-inquiry.graphql";
import controlsQuery from "@projectcaluma/ember-distribution/gql/queries/controls.graphql";
import inquiryDialogQuery from "@projectcaluma/ember-distribution/gql/queries/inquiry-dialog.graphql";
import navigationQuery from "@projectcaluma/ember-distribution/gql/queries/navigation.graphql";
import uniqueByGroups from "@projectcaluma/ember-distribution/utils/unique-by-groups";

export default class DistributionService extends Service {
  @service("-scheduler") scheduler;
  @service calumaOptions;
  @service router;
  @service intl;
  @service notification;

  @queryManager apollo;

  @config config;

  @tracked caseId;

  get hasInquiries() {
    return (
      this.navigation.value?.addressed.edges.length > 0 ||
      this.navigation.value?.controlling.edges.length > 0 ||
      this.navigation.value?.more.edges.length > 0
    );
  }

  controls = trackedTask(this, this.fetchControls, () => [this.caseId]);
  navigation = trackedTask(this, this.fetchNavigation, () => [this.caseId]);

  async refetch() {
    await this.refetchControls();
    await this.refetchNavigation();
  }

  async refetchNavigation() {
    await getObservable(this.navigation.value)?.refetch();
  }

  async refetchControls() {
    await getObservable(this.controls.value)?.refetch();
  }

  @dropTask
  *fetchControls(caseId) {
    return yield this.apollo.watchQuery({
      query: controlsQuery,
      variables: {
        caseId,
        currentGroup: String(this.calumaOptions.currentGroupId),
        createTask: this.config.controls.createTask,
        completeTask: this.config.controls.completeTask,
        inquiryTask: this.config.inquiry.task,
        checkTask: this.config.controls.checkTask,
      },
    });
  }

  @dropTask
  *fetchNavigation(caseId) {
    const response = yield this.apollo.watchQuery({
      query: navigationQuery,
      variables: {
        caseId,
        task: this.config.inquiry.task,
        currentGroup: String(this.calumaOptions.currentGroupId),
        statusQuestion: this.config.inquiry.answer.statusQuestion,
        deadlineQuestion: this.config.inquiry.deadlineQuestion,
      },
    });

    getObservable(response).subscribe(({ data }) => {
      const groupIds = [
        ...new Set(
          Object.values(data)
            .map((inquiries) => {
              return inquiries.edges.map((edge) => [
                ...edge.node.addressedGroups,
                ...edge.node.controllingGroups,
              ]);
            })
            .flat(2)
        ),
      ];

      // Resolve all involved groups with the scheduler each time the query is
      // updated. This will only trigger requests for new groups that are not in
      // the cache.
      this.scheduler.resolve(groupIds, "group");
    });

    return response;
  }

  @dropTask
  *createInquiry(groups, context = {}) {
    try {
      // get create inquiry work item to complete
      const createId = decodeId(this.controls.value?.create.edges[0].node.id);

      // refetch dialog queries of the groups that will have a new inquiry
      const refetchQueries = groups.map((group) => ({
        query: inquiryDialogQuery,
        variables: {
          from: String(this.calumaOptions.currentGroupId),
          to: String(group),
          caseId: this.caseId,
          task: this.config.inquiry.task,
          infoQuestion: this.config.inquiry.infoQuestion,
          deadlineQuestion: this.config.inquiry.deadlineQuestion,
          statusQuestion: this.config.inquiry.answer.statusQuestion,
          answerInfoQuestions: this.config.inquiry.answer.infoQuestions,
          buttonTasks: Object.keys(this.config.inquiry.answer.buttons),
        },
      }));

      // create new inquiries
      yield this.apollo.mutate({
        mutation: createInquiryMutation,
        variables: {
          id: createId,
          context: JSON.stringify({
            ...context,
            addressed_groups: groups.map(String),
          }),
        },
        refetchQueries,
      });

      // refetch navigation and controls data
      yield this.refetch();
    } catch (e) {
      this.notification.danger(
        this.intl.t("caluma.distribution.new.error", { count: groups.length })
      );
    }
  }

  @cached
  get inquiries() {
    const findGroupName = (identifiers) => {
      const group = this.scheduler.groupCache.find((group) =>
        identifiers
          .map(String)
          .includes(String(group[this.calumaOptions.groupIdentifierProperty]))
      );

      return group?.[this.calumaOptions.groupNameProperty] ?? "";
    };

    return Object.entries(this.navigation.value ?? {}).reduce(
      (inquiries, [key, objects]) => {
        return {
          ...inquiries,
          // Don't return any data until the internal scheduler has cached
          // groups since we don't want to render empty navigation items
          [key]: this.scheduler.groupCache.length
            ? uniqueByGroups(
                objects.edges.map((edge) => ({
                  ...edge.node,
                  // Populate the work item with the names of the involved
                  // groups so the <DistributionNavigation::Section /> component
                  // can sort by them
                  addressedGroupName: findGroupName(edge.node.addressedGroups),
                  controllingGroupName: findGroupName(
                    edge.node.controllingGroups
                  ),
                }))
              ).sort((a, b) => {
                const sortProperty =
                  key === "addressed"
                    ? "controllingGroupName"
                    : "addressedGroupName";

                return a[sortProperty].localeCompare(b[sortProperty]);
              })
            : [],
        };
      },
      {}
    );
  }
}
