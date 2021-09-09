import { getOwner } from "@ember/application";
import { assert } from "@ember/debug";
import { computed, defineProperty } from "@ember/object";
import { inject as service } from "@ember/service";
import jexl from "jexl";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import { intersects, mapby } from "@projectcaluma/ember-core/utils/jexl";
import Base from "@projectcaluma/ember-form/lib/base";

const onlyNumbers = (nums) =>
  nums.filter((num) => !isNaN(num) && typeof num === "number");
const sum = (nums) => nums.reduce((num, base) => base + num, 0);

/**
 * Object which represents a document
 *
 * @class Document
 */
export default Base.extend({
  calumaStore: service(),

  init(...args) {
    assert(
      "A graphql document `raw` must be passed",
      this.raw && this.raw.__typename === "Document"
    );

    defineProperty(this, "pk", {
      writable: false,
      value: `Document:${decodeId(this.raw.id)}`,
    });

    this._super(...args);

    this.set("fieldsets", []);

    this._createRootForm();
    this._createFieldsets();
  },

  _createRootForm() {
    const rootForm =
      this.calumaStore.find(`Form:${this.raw.rootForm.slug}`) ||
      getOwner(this)
        .factoryFor("caluma-model:form")
        .create({ raw: this.raw.rootForm });

    this.set("rootForm", rootForm);
  },

  _createFieldsets() {
    const fieldsets = this.raw.forms.map((form) => {
      return (
        this.calumaStore.find(`${this.pk}:Form:${form.slug}`) ||
        getOwner(this)
          .factoryFor("caluma-model:fieldset")
          .create({
            raw: { form, answers: this.raw.answers },
            document: this,
          })
      );
    });

    this.set("fieldsets", fieldsets);
  },

  willDestroy(...args) {
    this._super(...args);

    const fieldsets = this.fieldsets;
    this.set("fieldsets", []);
    fieldsets.forEach((fieldset) => fieldset.destroy());
  },

  /**
   * The uuid of the document
   *
   * @property {String} uuid
   * @accessor
   */
  uuid: computed("raw.id", function () {
    return decodeId(this.raw.id);
  }),

  /**
   * The root form of this document
   *
   * @property {Form} rootForm
   * @accessor
   */
  rootForm: null,

  /**
   * The fieldsets of this document
   *
   * @property {Fieldset[]} fieldsets
   * @accessor
   */
  fieldsets: null,

  /**
   * All fields of all fieldsets of this document
   *
   * @property {Field[]} fields
   * @accessor
   */
  fields: computed("fieldsets.@each.fields", function () {
    return this.fieldsets.reduce(
      (fields, fieldset) => [...fields, ...fieldset.fields],
      []
    );
  }),

  /**
   * The JEXL object for evaluating jexl expressions on this document
   *
   * @property {JEXL} jexl
   * @accessor
   */
  jexl: computed(function () {
    const documentJexl = new jexl.Jexl();

    documentJexl.addTransform("answer", (slug, defaultValue) =>
      this.findAnswer(slug, defaultValue)
    );
    documentJexl.addTransform("mapby", mapby);
    documentJexl.addBinaryOp("intersects", 20, intersects);
    documentJexl.addTransform("debug", (any, label = "JEXL Debug") => {
      // eslint-disable-next-line no-console
      console.debug(`${label}:`, any);
      return any;
    });
    documentJexl.addTransform("min", (arr) => {
      const nums = onlyNumbers(arr);
      return nums.length ? Math.min(...nums) : null;
    });
    documentJexl.addTransform("max", (arr) => {
      const nums = onlyNumbers(arr);
      return nums.length ? Math.max(...nums) : null;
    });
    documentJexl.addTransform("round", (num, places = 0) =>
      !onlyNumbers([num]).length
        ? null
        : Math.round(num * Math.pow(10, places)) / Math.pow(10, places)
    );
    documentJexl.addTransform("ceil", (num) =>
      !onlyNumbers([num]).length ? null : Math.ceil(num)
    );
    documentJexl.addTransform("floor", (num) =>
      !onlyNumbers([num]).length ? null : Math.floor(num)
    );
    documentJexl.addTransform("sum", (arr) => sum(onlyNumbers(arr)));
    documentJexl.addTransform("avg", (arr) => {
      const nums = onlyNumbers(arr);
      return nums.length ? sum(nums) / nums.length : null;
    });
    documentJexl.addTransform("stringify", (input) => JSON.stringify(input));

    return documentJexl;
  }),

  /**
   * The JEXL context object for passing to the evaluation of jexl expessions
   *
   * @property {Object} jexlContext
   * @accessor
   */
  jexlContext: computed(
    "rootForm.{slug,meta}",
    "parentDocument.jexlContext",
    function () {
      if (this.parentDocument) return this.parentDocument.jexlContext;

      return {
        // JEXL interprets null in an expression as variable instead of a
        // primitive. This resolves that issue.
        null: null,
        form: this.rootForm.slug,
        info: {
          root: { form: this.rootForm.slug, formMeta: this.rootForm.meta },
        },
      };
    }
  ),

  /**
   * Object representation of a document. The question slug as key and the
   * answer value as value. E.g:
   *
   * ```json
   * {
   *   "some-question": "Test Value",
   *   "some-other-question": 123,
   * }
   * ```
   *
   * This is needed for comparing a table row with the table questions default
   * answer.
   *
   * @property {Object} flatAnswerMap
   * @accessor
   */
  flatAnswerMap: computed("fields.@each.{question,value}", function () {
    return this.fields.reduce(
      (answerMap, field) => ({
        ...answerMap,
        [field.question.slug]: field.value,
      }),
      {}
    );
  }),

  /**
   * Find an answer for a given question slug
   *
   * @param {String} slug The slug of the question to find the answer for
   * @param {*} defaultValue The value that will be returned if the question doesn't exist
   * @return {*} The answer to the given question
   */
  findAnswer(slug, defaultValue) {
    const field = this.findField(slug);

    if (!field) {
      if (defaultValue === undefined) {
        throw new Error(`Field for question \`${slug}\` could not be found`);
      }

      return defaultValue;
    }

    if (field.hidden || [undefined, null].includes(field.value)) {
      return field.question.isMultipleChoice ? [] : null;
    }

    if (field.question.__typename === "TableQuestion") {
      return field.value.map((doc) =>
        doc.fields
          .filter((field) => !field.hidden)
          .reduce((obj, tableField) => {
            return {
              ...obj,
              [tableField.question.slug]: tableField.value,
            };
          }, {})
      );
    }

    return field.value;
  },

  /**
   * Find a field in the document by a given question slug
   *
   * @param {String} slug The slug of the wanted field
   * @return {Field} The wanted field
   */
  findField(slug) {
    return [
      ...this.fields,
      ...(this.parentDocument ? this.parentDocument.fields : []),
    ].find((field) => field.question.slug === slug);
  },
});
