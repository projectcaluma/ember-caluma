import Base from "ember-caluma/lib/base";
import { assert } from "@ember/debug";
import { getOwner } from "@ember/application";

import Field from "ember-caluma/lib/field";
import Form from "ember-caluma/lib/form";
import { computed } from "@ember/object";

/**
 * @class Fieldset
 */
export default Base.extend({
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

    this.set(
      "form",
      Form.create(getOwner(this).ownerInjection(), {
        raw: this.raw.form,
        fieldset: this
      })
    );

    this.set(
      "fields",
      this.raw.form.questions.map(question => {
        return Field.create(getOwner(this).ownerInjection(), {
          raw: {
            question,
            answer: this.raw.answers.find(
              answer => answer.question.slug === question.slug
            )
          },
          fieldset: this
        });
      })
    );
  },

  field: computed("form.slug", "document.fields.[]", function() {
    return this.document.fields
      .filter(field => field.questionType === "FormQuestion")
      .find(field => field.question.subForm.slug === this.form.slug);
  })
});
