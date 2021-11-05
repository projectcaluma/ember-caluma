import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { Changeset } from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import { task } from "ember-concurrency";

import slugify from "@projectcaluma/ember-core/utils/slugify";
import saveChoiceQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-choice-question.graphql";
import saveMultipleChoiceQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-multiple-choice-question.graphql";
import OptionValidations from "@projectcaluma/ember-form-builder/validations/option";

const TYPES = {
  MultipleChoiceQuestion: saveMultipleChoiceQuestionMutation,
  ChoiceQuestion: saveChoiceQuestionMutation,
};

const removeQuestionPrefix = (slug, questionSlug) => {
  return slug.replace(new RegExp(`^${questionSlug}-`), "");
};

const addQuestionPrefix = (slug, questionSlug) => {
  return `${questionSlug}-${slug}`;
};

export default class CfbFormEditorQuestionOptions extends Component {
  @tracked _optionRows;

  @service intl;
  @service notification;
  @queryManager apollo;

  constructor(...args) {
    super(...args);

    this._optionRows = this.args.value?.edges?.length
      ? this.args.value.edges.map(
          (edge) =>
            new Changeset(
              {
                slug: removeQuestionPrefix(edge.node.slug, this.questionSlug),
                label: edge.node.label,
                isArchived: edge.node.isArchived,
                isNew: false,
              },
              lookupValidator(OptionValidations),
              OptionValidations
            )
        )
      : [
          new Changeset(
            { slug: "", label: "", isNew: true, linkSlug: true },
            lookupValidator(OptionValidations),
            OptionValidations
          ),
        ];
  }

  get questionSlug() {
    return this.args.model.slug;
  }

  get optionRows() {
    return this._optionRows;
  }

  _update() {
    this.args.update({
      edges: this.optionRows
        .filter((row) => !row.isNew || row.isDirty)
        .map((row) => {
          const { label, slug, isArchived } = Object.assign(
            {},
            row.get("data"),
            row.get("change")
          );

          return {
            node: {
              label,
              slug: addQuestionPrefix(
                removeQuestionPrefix(slug, this.questionSlug),
                this.questionSlug
              ),
              isArchived: Boolean(isArchived),
            },
          };
        }),
    });

    this.args.setDirty();
  }

  @task
  *reorderOptions(slugs) {
    try {
      yield this.apollo.mutate({
        mutation: TYPES[this.args.model.__typename],
        variables: {
          input: {
            slug: this.questionSlug,
            label: this.args.model.label,
            options: slugs,
          },
        },
      });

      this.notification.success(
        this.intl.t(
          "caluma.form-builder.notification.form.reorder-options.success"
        )
      );
    } catch (e) {
      this.notification.danger(
        this.intl.t(
          "caluma.form-builder.notification.form.reorder-options.error"
        )
      );
    }
  }

  @action
  addRow() {
    this._optionRows = [
      ...this.optionRows,
      new Changeset(
        { slug: "", label: "", isNew: true, linkSlug: true },
        lookupValidator(OptionValidations),
        OptionValidations
      ),
    ];

    this._update();
  }

  @action
  deleteRow(row) {
    this._optionRows = this.optionRows.filter((r) => r !== row);

    this._update();
  }

  @action
  toggleRowArchived(row) {
    row.set("isArchived", !row.get("isArchived"));

    this._update();
  }

  @action
  updateLabel(value, changeset) {
    changeset.set("label", value);

    if (changeset.get("isNew") && changeset.get("linkSlug")) {
      changeset.set(
        "slug",
        slugify(value, { locale: this.intl.primaryLocale })
      );
    }
    this._update();
  }

  @action
  updateSlug(value, changeset) {
    changeset.set("slug", value);
    changeset.set("linkSlug", false);
    this._update();
  }

  @action
  update() {
    this._update();
  }

  @action
  _handleMoved({ detail: [sortable] }) {
    // Remove last element as it is the add row button
    const options = [...sortable.$el.children].slice(0, -1);

    this.reorderOptions.perform(
      options.map((option) =>
        addQuestionPrefix(
          option.firstElementChild.firstElementChild.id,
          this.questionSlug
        )
      )
    );
  }
}
