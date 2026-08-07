import { getOwner } from "@ember/application";
import { action } from "@ember/object";
import { guidFor } from "@ember/object/internals";
import { next } from "@ember/runloop";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import { trackedFunction } from "reactiveweb/function";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import config from "@projectcaluma/ember-distribution/config";
import inquiryFormQuery from "@projectcaluma/ember-distribution/gql/queries/inquiry-form.graphql";
import { parseDocument } from "@projectcaluma/ember-form/lib/parsers";

export default class CdInquiryNewFormBulkEditComponent extends Component {
  @service router;
  @service distribution;
  @service calumaOptions;

  @queryManager apollo;

  @config config;

  answers = {};

  /**
   * Build the global JEXL context of the inquiry document.
   *
   * Neither the document nor its work item exist in the backend while the form
   * is being filled out, so `documentGlobalJexlContext` can't be used here. The
   * case comes from the controls query, the work item is the one
   * `createInquiry` is about to create.
   *
   * @async
   * @private
   * @method #buildJexlContext
   * @returns {Promise<Object>} The "faked" JEXL context for the bulk edit form
   */
  async #buildJexlContext() {
    await this.distribution.controls;

    const _case = this.distribution.controls.value?.case.edges[0]?.node;
    // A case without a family is its own root, same as in the backend
    const root = _case?.family ?? _case;

    return {
      info: {
        case: _case
          ? {
              form: _case.document?.form.slug ?? null,
              workflow: _case.workflow.slug,
              meta: _case.meta,
              root: {
                form: root.document?.form.slug ?? null,
                workflow: root.workflow.slug,
                meta: root.meta,
              },
            }
          : null,
        workItem: {
          task: this.config.inquiry.task,
          meta: await this.calumaOptions.distributionInquiryWorkItemMeta(
            this.args.selectedGroups,
          ),
        },
      },
    };
  }

  document = trackedFunction(this, async () => {
    // Fetch the full form (like in cf-content) of the inquiry task
    const response = await this.apollo.query({
      query: inquiryFormQuery,
      variables: {
        inquiryTask: this.config.inquiry.task,
      },
    });
    const form = response.allTasks.edges[0].node.form;
    const answers = { edges: [] };
    const jexlContext = await this.#buildJexlContext();

    // If we configured a default deadline lead time, we need to calculate the
    // deadline that should be displayed in the form per default and add it to
    // the fake document data
    if (this.config.new.defaultDeadlineLeadTime) {
      const deadline =
        await this.calumaOptions.calculateDistributionDefaultDeadline(
          this.config.new.defaultDeadlineLeadTime,
          this.args.selectedGroups,
        );

      answers.edges.push({
        node: {
          dateValue: deadline,
          question: {
            slug: this.config.inquiry.deadlineQuestion,
          },
          __typename: "DateAnswer",
        },
      });

      this.answers[this.config.inquiry.deadlineQuestion] = deadline;
    }

    // Generate a parsed raw data object which can be used for creating a caluma
    // form lib layer document which we need for displaying a form. This is
    // normally done in the cf-content component which fetches the form (like we
    // do above) and the document from the backend and then merges it together
    // with this function. However, since we need a document without existence
    // in the backend, we need to create this object ourselves.
    const raw = parseDocument({
      id: btoa(`Document:inquiry-document-${guidFor(this)}`),
      __typename: "Document",
      answers,
      form,
      jexlContext,
    });

    const owner = getOwner(this);
    const Document = owner.factoryFor("caluma-model:document").class;

    return new Document({ raw, owner });
  });

  get fieldset() {
    return this.document.value?.fieldsets[0];
  }

  @action
  async saveField(field, value) {
    field.answer.value = value;

    await field.validate.perform();

    this.answers[field.question.slug] = value;
  }

  submit = task({ drop: true }, async (validate, e) => {
    e.preventDefault();

    if (!this.args.selectedGroups.length || !(await validate())) return;

    await this.distribution.createInquiry.perform(this.args.selectedGroups, {
      answers: this.answers,
    });

    next(this, "transitionToFirstInquiryOfGroup", this.args.selectedGroups[0]);
  });

  transitionToFirstInquiryOfGroup(group) {
    const firstCreated = this.distribution.navigation.value.controlling.edges
      .map((edge) => edge.node)
      .find((node) => node.addressedGroups.includes(String(group)));

    // transition to inquiry addressed to the first selected group
    this.router.transitionTo(
      "inquiry.detail.index",
      {
        from: firstCreated.controllingGroups[0],
        to: firstCreated.addressedGroups[0],
      },
      decodeId(firstCreated.id),
    );
  }
}
