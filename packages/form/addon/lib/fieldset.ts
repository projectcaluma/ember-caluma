import { getOwner } from "@ember/application";
import { associateDestroyableChild } from "@ember/destroyable";
import { cached } from "tracked-toolbox";

import Base from "@projectcaluma/ember-form/lib/base";
import Document from "@projectcaluma/ember-form/lib/document";
import Field from "@projectcaluma/ember-form/lib/field";
import Form from "@projectcaluma/ember-form/lib/form";

/**
 * Object that represents a combination of a document and a form
 */
export default class Fieldset extends Base {
  constructor({
    document,
    raw,
    owner,
  }: {
    document: Document;
    raw: RawFieldset;
    owner: unknown;
  }) {
    super({ owner });

    this.raw = raw;
    this.document = document;

    this.pushIntoStore();

    this.form = this._createForm();
    this.fields = this._createFields();
  }

  _createForm(): Form {
    const owner = getOwner(this);
    const klass = owner.factoryFor("caluma-model:form").class as typeof Form;

    const existing = this.calumaStore.find(
      `Form:${this.raw.form.slug}`
    ) as Form | null;

    return existing ?? new klass({ raw: this.raw.form, owner });
  }

  _createFields(): Field[] {
    const owner = getOwner(this);
    const klass = owner.factoryFor("caluma-model:field").class as typeof Field;

    return this.raw.form.questions.map((question) => {
      const existing = this.calumaStore.find(
        `${this.document.pk}:Question:${question.slug}`
      ) as Field | null;

      return associateDestroyableChild(
        this,
        existing ??
          new klass({
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
  }

  /**
   * The raw data of the fieldset
   */
  readonly raw: RawFieldset;

  /**
   * The form for this fieldset
   */
  readonly form: Form;

  /**
   * The document for this fieldset
   */
  readonly document: Document;

  /**
   * The fields in this fieldset
   */
  readonly fields: Field[];

  /**
   * The primary key of the fieldset. Consists of the document and form primary
   * keys.
   */
  @cached
  get pk(): string {
    return `${this.document.pk}:Form:${this.raw.form.slug}`;
  }

  /**
   * The field for this fieldset. A fieldset has a `field` if there is a form
   * question pointing to the fieldsets form in the document.
   */
  @cached
  get field(): Field | undefined {
    return this.document.fields
      .filter((field) => field.questionType === "FormQuestion")
      .find((field) => field.question.raw.subForm?.slug === this.form.slug);
  }
}
