import { getOwner } from "@ember/application";
import { assert } from "@ember/debug";
import { associateDestroyableChild } from "@ember/destroyable";
import { cached } from "tracked-toolbox";

import Base from "@projectcaluma/ember-form/lib/base";

/**
 * Object that represents a combination of a document and a form
 *
 * @class Fieldset
 */
export default class Fieldset extends Base {
  constructor({ document, raw, ...args }) {
    assert("`document` must be passed as an argument", document);

    assert(
      "A graphql form `raw.form` must be passed",
      raw?.form?.__typename === "Form"
    );
    assert(
      "A collection of graphql answers `raw.answers` must be passed",
      raw?.answers?.every((answer) => /Answer$/.test(answer.__typename))
    );

    super({ raw, ...args });

    this.document = document;

    this.pushIntoStore();

    this._createForm();
    this._createFields();
  }

  _createForm() {
    const owner = getOwner(this);

    const form =
      this.calumaStore.find(`Form:${this.raw.form.slug}`) ||
      new (owner.factoryFor("caluma-model:form").class)({
        raw: this.raw.form,
        owner,
      });

    this.form = form;
  }

  _createFields() {
    const owner = getOwner(this);

    const fields = this.raw.form.questions.map((question) => {
      return associateDestroyableChild(
        this,
        this.calumaStore.find(
          `${this.document.pk}:Question:${question.slug}`
        ) ||
          new (owner.factoryFor("caluma-model:field").class)({
            raw: {
              question,
              answer: this.raw.answers.find(
                (answer) => answer?.question?.slug === question.slug
              ),
            },
            fieldset: this,
            owner,
          })
      );
    });

    this.fields = fields;
  }

  /**
   * The primary key of the fieldset. Consists of the document and form primary
   * keys.
   *
   * @property {String} pk
   */
  @cached
  get pk() {
    return `${this.document.pk}:Form:${this.raw.form.slug}`;
  }

  /**
   * The field for this fieldset. A fieldset has a `field` if there is a form
   * question pointing to the fieldsets form in the document.
   *
   * @property {Field} field
   */
  @cached
  get field() {
    return this.document.fields
      .filter((field) => field.questionType === "FormQuestion")
      .find((field) => field.question.raw.subForm.slug === this.form.slug);
  }

  /**
   * The form for this fieldset
   *
   * @property {Form} form
   */
  form = null;

  /**
   * The fields in this fieldset
   *
   * @property {Field[]} fields
   */
  fields = [];
}
