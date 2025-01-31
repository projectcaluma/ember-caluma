import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { Changeset } from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import { dropTask } from "ember-concurrency";

import slugify from "@projectcaluma/ember-core/utils/slugify";
import saveChoiceQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-choice-question.graphql";
import saveMultipleChoiceQuestionMutation from "@projectcaluma/ember-form-builder/gql/mutations/save-multiple-choice-question.graphql";
import OptionValidations from "@projectcaluma/ember-form-builder/validations/option";

const TYPES = {
  MultipleChoiceQuestion: saveMultipleChoiceQuestionMutation,
  ChoiceQuestion: saveChoiceQuestionMutation,
};

export default class CfbFormEditorQuestionOptions extends Component {
  @service intl;
  @service notification;

  @queryManager apollo;

  get canReorder() {
    return this.args.value.every((row) => row.get("id") !== undefined);
  }

  @dropTask
  *reorderOptions(slugs) {
    try {
      yield this.apollo.mutate({
        mutation: TYPES[this.args.model.__typename],
        variables: {
          input: {
            slug: this.args.model.slug,
            label: this.args.model.label,
            options: slugs,
          },
        },
      });

      this.notification.success(
        this.intl.t(
          "caluma.form-builder.notification.form.reorder-options.success",
        ),
      );
    } catch (e) {
      this.notification.danger(
        this.intl.t(
          "caluma.form-builder.notification.form.reorder-options.error",
        ),
      );
    }
  }

  @action
  addRow() {
    this.args.update([
      ...this.args.value,
      new Changeset(
        {
          id: undefined,
          slug: "",
          label: "",
          isArchived: false,
          isHidden: "false",
          slugUnlinked: false,
          question: this.args.model.slug,
        },
        lookupValidator(OptionValidations),
        OptionValidations,
      ),
    ]);

    this.args.setDirty();
  }

  @action
  deleteRow(row) {
    this.args.update(this.args.value.filter((r) => r !== row));
    this.args.setDirty();
  }

  @action
  updateLabel(value, changeset) {
    changeset.set("label", value);

    if (!changeset.get("id") && !changeset.get("slugUnlinked")) {
      const slugifiedLabel = slugify(value, {
        locale: this.intl.primaryLocale,
      });
      const slug = slugifiedLabel
        ? `${this.args.model.slug}-${slugifiedLabel}`
        : "";

      changeset.set("slug", slug);
    }
  }

  @action
  _handleMoved({ detail: [sortable] }) {
    // Remove last element as it is the add row button
    const options = [...sortable.$el.children].slice(0, -1);

    this.reorderOptions.perform(
      options.map((option) => option.firstElementChild.firstElementChild.id),
    );
  }
}
