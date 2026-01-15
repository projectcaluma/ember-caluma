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
