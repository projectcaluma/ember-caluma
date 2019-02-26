import RenderComponent from "ember-validated-form/components/validated-input/-themes/uikit/render";
import Changeset from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import OptionValidations from "ember-caluma-form-builder/validations/option";
import layout from "../../../templates/components/cfb-form-editor/question/options";
import slugify from "ember-caluma-form-builder/utils/slugify";
import { get } from "@ember/object";
import { reads } from "@ember/object/computed";

const removeQuestionPrefix = (slug, questionSlug) => {
  return slug.replace(new RegExp(`^${questionSlug}-`), "");
};

const addQuestionPrefix = (slug, questionSlug) => {
  return `${questionSlug}-${slug}`;
};

export default RenderComponent.extend({
  layout,

  questionSlug: reads("model.slug"),

  init() {
    this._super(...arguments);

    const value = this.get("value");

    this.set(
      "optionRows",
      get(value, "edges.length")
        ? get(value, "edges").map(
            v =>
              new Changeset(
                {
                  slug: removeQuestionPrefix(v.node.slug, this.questionSlug),
                  label: v.node.label,
                  isNew: false
                },
                lookupValidator(OptionValidations),
                OptionValidations
              )
          )
        : [
            new Changeset(
              { slug: "", label: "", isNew: true },
              lookupValidator(OptionValidations),
              OptionValidations
            )
          ]
    );
  },

  _update() {
    this.update({
      edges: this.optionRows
        .filter(row => !get(row, "isNew") || get(row, "isDirty"))
        .map(row => {
          const { label, slug } = Object.assign(
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
              )
            }
          };
        })
    });

    this.setDirty();
  },

  actions: {
    addRow() {
      this.set("optionRows", [
        ...this.optionRows,
        new Changeset(
          { slug: "", label: "", isNew: true },
          lookupValidator(OptionValidations),
          OptionValidations
        )
      ]);

      this._update();
    },

    deleteRow(row) {
      this.set("optionRows", this.optionRows.filter(r => r !== row));

      this._update();
    },

    updateLabel(value, changeset) {
      changeset.set("label", value);

      if (changeset.get("isNew")) {
        changeset.set("slug", slugify(value));
      }
    },

    update() {
      this._update();
    }
  }
});
