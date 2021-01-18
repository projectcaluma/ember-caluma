import { get } from "@ember/object";
import { reads } from "@ember/object/computed";
import { run } from "@ember/runloop";
import { inject as service } from "@ember/service";
import Changeset from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import { task } from "ember-concurrency";
import RenderComponent from "ember-validated-form/components/validated-input/-themes/uikit/render";
import UIkit from "uikit";

import layout from "../../../templates/components/cfb-form-editor/question/options";

import saveChoiceQuestionMutation from "ember-caluma/gql/mutations/save-choice-question";
import saveMultipleChoiceQuestionMutation from "ember-caluma/gql/mutations/save-multiple-choice-question";
import slugify from "ember-caluma/utils/slugify";
import OptionValidations from "ember-caluma/validations/option";

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

export default RenderComponent.extend({
  layout,

  intl: service(),
  notification: service(),
  apollo: service(),

  questionSlug: reads("model.slug"),

  init(...args) {
    this._super(...args);

    const value = this.value;

    this.set(
      "optionRows",
      get(value, "edges.length")
        ? value.edges.map(
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
          ]
    );
  },

  didInsertElement(...args) {
    this._super(...args);
    this.setupUIkit();
  },

  _update() {
    this.update({
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

    this.setDirty();
  },

  setupUIkit() {
    UIkit.util.on("#option-list", "moved", (...args) =>
      run(this, this._handleMoved, ...args)
    );
  },

  _handleMoved({ detail: [sortable] }) {
    const options = [...sortable.$el.children];
    // Remove last element as it is the add row button
    options.pop();

    this.reorderQuestions.perform(
      options.map((option) =>
        addQuestionPrefix(option.firstElementChild.id, this.questionSlug)
      )
    );
  },

  reorderQuestions: task(function* (slugs) {
    try {
      yield this.apollo.mutate({
        mutation: TYPES[this.model.__typename],
        variables: {
          input: {
            slug: this.questionSlug,
            label: this.model.label,
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
  }),

  actions: {
    addRow() {
      this.set("optionRows", [
        ...this.optionRows,
        new Changeset(
          { slug: "", label: "", isNew: true, linkSlug: true },
          lookupValidator(OptionValidations),
          OptionValidations
        ),
      ]);

      this._update();
    },

    deleteRow(row) {
      this.set(
        "optionRows",
        this.optionRows.filter((r) => r !== row)
      );

      this._update();
    },

    toggleRowArchived(row) {
      row.set("isArchived", !row.get("isArchived"));

      this._update();
    },

    updateLabel(value, changeset) {
      changeset.set("label", value);

      if (changeset.get("isNew") && changeset.get("linkSlug")) {
        changeset.set(
          "slug",
          slugify(value, { locale: this.intl.primaryLocale })
        );
      }
    },

    updateSlug(value, changeset) {
      changeset.set("slug", value);
      changeset.set("linkSlug", false);
    },

    update() {
      this._update();
    },
  },
});
