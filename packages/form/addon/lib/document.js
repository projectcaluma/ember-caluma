import { getOwner } from "@ember/application";
import { assert } from "@ember/debug";
import { associateDestroyableChild } from "@ember/destroyable";
import jexl from "jexl";
import { cached } from "tracked-toolbox";

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
export default class Document extends Base {
  constructor({ raw, parentDocument, ...args }) {
    assert(
      "A graphql document `raw` must be passed",
      raw?.__typename === "Document"
    );

    super({ raw, ...args });

    this.parentDocument = parentDocument;

    this.pushIntoStore();

    this._createRootForm();
    this._createFieldsets();
  }

  _createRootForm() {
    const owner = getOwner(this);

    this.rootForm =
      this.calumaStore.find(`Form:${this.raw.rootForm.slug}`) ||
      new (owner.factoryFor("caluma-model:form").class)({
        raw: this.raw.rootForm,
        owner,
      });
  }

  _createFieldsets() {
    const owner = getOwner(this);

    this.fieldsets = this.raw.forms.map((form) => {
      return associateDestroyableChild(
        this,
        this.calumaStore.find(`${this.pk}:Form:${form.slug}`) ||
          new (owner.factoryFor("caluma-model:fieldset").class)({
            raw: { form, answers: this.raw.answers },
            document: this,
            owner,
          })
      );
    });
  }

  /**
   * The parent document of this document. If this is set, the document is most
   * likely a table row.
   *
   * @property {Document} parentDocument
   */
  parentDocument = null;

  /**
   * The root form of this document
   *
   * @property {Form} rootForm
   */
  rootForm = null;

  /**
   * The fieldsets of this document
   *
   * @property {Fieldset[]} fieldsets
   */
  fieldsets = [];

  /**
   * The primary key of the document.
   *
   * @property {String} pk
   */
  @cached
  get pk() {
    return `Document:${this.uuid}`;
  }

  /**
   * The uuid of the document
   *
   * @property {String} uuid
   */
  @cached
  get uuid() {
    return decodeId(this.raw.id);
  }

  @cached
  get workItemUuid() {
    // The document is either directly attached to a work item (via
    // CompleteTaskFormTask) or it's the case document and therefore
    // indirectly attached to a work item (via CompleteWorkflowFormTask)
    const rawId =
      this.raw.workItem?.id ||
      this.raw.case?.workItems.edges.find(
        (edge) => edge.node.task.__typename === "CompleteWorkflowFormTask"
      )?.node.id;

    return rawId ? decodeId(rawId) : null;
  }

  /**
   * All fields of all fieldsets of this document
   *
   * @property {Field[]} fields
   */
  @cached
  get fields() {
    return this.fieldsets.flatMap((fieldset) => fieldset.fields);
  }

  /**
   * The JEXL object for evaluating jexl expressions on this document
   *
   * @property {JEXL} jexl
   */
  @cached
  get jexl() {
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
  }

  /**
   * The JEXL context object for passing to the evaluation of jexl expessions
   *
   * @property {Object} jexlContext
   */
  get jexlContext() {
    return (
      this.parentDocument?.jexlContext ?? {
        // JEXL interprets null in an expression as variable instead of a
        // primitive. This resolves that issue.
        null: null,
        form: this.rootForm.slug,
        info: {
          root: {
            form: this.rootForm.slug,
            formMeta: this.rootForm.raw.meta,
          },
        },
      }
    );
  }

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
   */
  @cached
  get flatAnswerMap() {
    return this.fields.reduce(
      (answerMap, field) => ({
        ...answerMap,
        [field.question.slug]: field.value,
      }),
      {}
    );
  }

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
      return defaultValue ?? field.question.isMultipleChoice ? [] : null;
    }

    if (field.question.isTable) {
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
  }

  /**
   * Find a field in the document by a given question slug
   *
   * @param {String} slug The slug of the wanted field
   * @return {Field} The wanted field
   */
  findField(slug) {
    return [...this.fields, ...(this.parentDocument?.fields ?? [])].find(
      (field) => field.question.slug === slug
    );
  }
}
