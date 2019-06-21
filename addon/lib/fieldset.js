import Base from "ember-caluma/lib/base";
import { assert } from "@ember/debug";
import { getOwner } from "@ember/application";
import { inject as service } from "@ember/service";
import Field from "ember-caluma/lib/field";
import Form from "ember-caluma/lib/form";
import { computed } from "@ember/object";

/**
 * Object that represents a combination of a document and a form
 *
 * @class Fieldset
 */
export default Base.extend({
  calumaStore: service(),

  init() {
    this._super(...arguments);

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
  },

  /**
   * The unique identifier for the fieldset which consists of the documents id
   * and the forms id separated by a colon.
   *
   * E.g: `Document:b01e9071-c63a-43a5-8c88-2daa7b02e411:Form:some-form-slug`
   *
   * @property {String} pk
   * @accessor
   */
  pk: computed("document.pk", "form.pk", function() {
    return [this.document.pk, this.form.pk].join(":");
  }),

  /**
   * The field for this fieldset. A fieldset has a `field` if there is a form
   * question pointing to the fieldsets form in the document.
   *
   * @property {Field} field
   * @accessor
   */
  field: computed("form.slug", "document.fields.[]", function() {
    return this.document.fields
      .filter(field => field.questionType === "FormQuestion")
      .find(field => field.question.subForm.slug === this.form.slug);
  }),

  /**
   * The form for this fieldset
   *
   * @property {Form} form
   * @accessor
   */
  form: computed("raw.form", function() {
    return (
      this.calumaStore.find(`Form:${this.raw.form.slug}`) ||
      this.calumaStore.push(
        Form.create(getOwner(this).ownerInjection(), {
          raw: this.raw.form
        })
      )
    );
  }),

  /**
   * The fields in this fieldset
   *
   * @property {Field[]} fields
   * @accessor
   */
  fields: computed("raw.{form.questions.[],answers.[]}", function() {
    return this.raw.form.questions.map(question => {
      return (
        this.calumaStore.find(
          `${this.document.pk}:Question:${question.slug}`
        ) ||
        this.calumaStore.push(
          Field.create(getOwner(this).ownerInjection(), {
            raw: {
              question,
              answer: this.raw.answers.find(
                answer => answer.question.slug === question.slug
              )
            },
            fieldset: this
          })
        )
      );
    });
  })
});
