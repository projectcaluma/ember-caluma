import Base from "ember-caluma/lib/base";
import { assert } from "@ember/debug";
import { getOwner } from "@ember/application";
import { inject as service } from "@ember/service";
import { computed, get, defineProperty } from "@ember/object";

/**
 * Object that represents a combination of a document and a form
 *
 * @class Fieldset
 */
export default Base.extend({
  calumaStore: service(),

  init() {
    assert(
      "A graphql form `raw.form` must be passed",
      this.raw && this.raw.form && this.raw.form.__typename === "Form"
    );

    assert(
      "A collection of graphql answers `raw.answers` must be passed",
      this.raw &&
        this.raw.answers &&
        (!this.raw.answers.lenght ||
          /Answer$/.test(this.raw.answers[0].__typename))
    );

    defineProperty(this, "pk", {
      writable: false,
      value: `${this.document.pk}:Form:${this.raw.form.slug}`,
    });

    this._super(...arguments);

    this.set("fields", []);

    this._createForm();
    this._createFields();
  },

  willDestroy() {
    this._super(...arguments);

    const fields = this.fields;
    this.set("fields", []);
    fields.forEach((field) => field.destroy());
  },

  _createForm() {
    const form =
      this.calumaStore.find(`Form:${this.raw.form.slug}`) ||
      getOwner(this)
        .factoryFor("caluma-model:form")
        .create({ raw: this.raw.form });

    this.set("form", form);
  },

  _createFields() {
    const fields = this.raw.form.questions.map((question) => {
      return (
        this.calumaStore.find(
          `${this.document.pk}:Question:${question.slug}`
        ) ||
        getOwner(this)
          .factoryFor("caluma-model:field")
          .create({
            raw: {
              question,
              answer: this.raw.answers.find(
                (answer) => get(answer, "question.slug") === question.slug
              ),
            },
            fieldset: this,
          })
      );
    });

    this.set("fields", fields);
  },

  /**
   * The field for this fieldset. A fieldset has a `field` if there is a form
   * question pointing to the fieldsets form in the document.
   *
   * @property {Field} field
   * @accessor
   */
  field: computed("form.slug", "document.fields.[]", function () {
    return this.document.fields
      .filter((field) => field.questionType === "FormQuestion")
      .find((field) => field.question.subForm.slug === this.form.slug);
  }),

  /**
   * The form for this fieldset
   *
   * @property {Form} form
   * @accessor
   */
  form: null,

  /**
   * The fields in this fieldset
   *
   * @property {Field[]} fields
   * @accessor
   */
  fields: null,
});
