import RenderComponent from "ember-validated-form/components/validated-input/-themes/uikit/render";
import Changeset from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import OptionValidations from "ember-caluma/validations/option";
import layout from "../../../templates/components/cfb-form-editor/question/options";
import slugify from "ember-caluma/utils/slugify";
import { get } from "@ember/object";
import { reads } from "@ember/object/computed";
import { inject as service } from "@ember/service";

const removeQuestionPrefix = (slug, questionSlug) => {
  return slug.replace(new RegExp(`^${questionSlug}-`), "");
};

const addQuestionPrefix = (slug, questionSlug) => {
  return `${questionSlug}-${slug}`;
};

export default RenderComponent.extend({
  layout,

  intl: service(),

  questionSlug: reads("model.slug"),

  init() {
    this._super(...arguments);

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

  _update() {
    this.update({
      edges: this.optionRows
        .filter((row) => !get(row, "isNew") || get(row, "isDirty"))
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
