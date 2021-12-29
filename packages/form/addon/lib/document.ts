import { getOwner } from "@ember/application";
import { associateDestroyableChild } from "@ember/destroyable";
import { Jexl } from "jexl";
import { cached } from "tracked-toolbox";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import { intersects, mapby } from "@projectcaluma/ember-core/utils/jexl";
import Base from "@projectcaluma/ember-form/lib/base";
import Field from "@projectcaluma/ember-form/lib/field";
import Fieldset from "@projectcaluma/ember-form/lib/fieldset";
import Form from "@projectcaluma/ember-form/lib/form";

const onlyNumbers = (nums: unknown[]): number[] =>
  nums.filter((num): num is number => typeof num === "number" && !isNaN(num));

const sum = (nums: number[]): number =>
  nums.reduce((num, base) => base + num, 0);

/**
 * Object which represents a document
 *
 * @class Document
 */
export default class Document extends Base {
  constructor({
    parentDocument,
    raw,
    owner,
  }: {
    parentDocument?: Document;
    raw: RawDocument;
    owner: unknown;
  }) {
    super({ owner });

    this.raw = raw;
    this.parentDocument = parentDocument;

    this.pushIntoStore();

    this.rootForm = this._createRootForm();
    this.fieldsets = this._createFieldsets();
  }

  _createRootForm(): Form {
    const existing = this.calumaStore.find(
      `Form:${this.raw.rootForm.slug}`
    ) as Form | null;

    if (existing) return existing;

    const owner = getOwner(this);
    const klass = owner.factoryFor("caluma-model:form").class as typeof Form;

    return new klass({ raw: this.raw.rootForm, owner });
  }

  _createFieldsets(): Fieldset[] {
    const owner = getOwner(this);
    const klass = owner.factoryFor("caluma-model:fieldset")
      .class as typeof Fieldset;

    return this.raw.forms.map((form) => {
      const existing = this.calumaStore.find(
        `${this.pk}:Form:${form.slug}`
      ) as Fieldset;

      return associateDestroyableChild(
        this,
        existing ??
          new klass({
            raw: { form, answers: this.raw.answers },
            document: this,
            owner,
          })
      );
    });
  }

  /**
   * The raw data of the document
   */
  readonly raw: RawDocument;

  /**
   * The parent document of this document. If this is set, the document is most
   * likely a table row.
   */
  readonly parentDocument?: Document;

  /**
   * The root form of this document
   */
  readonly rootForm: Form;

  /**
   * The fieldsets of this document
   */
  readonly fieldsets: Fieldset[];

  /**
   * The primary key of the document.
   */
  @cached
  get pk(): string {
    return `Document:${this.uuid}`;
  }

  /**
   * The uuid of the document
   */
  @cached
  get uuid(): string {
    return decodeId(this.raw.id);
  }

  @cached
  get workItemUuid(): string | null {
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
   */
  @cached
  get fields(): Field[] {
    return this.fieldsets.flatMap((fieldset) => fieldset.fields);
  }

  /**
   * The JEXL object for evaluating jexl expressions on this document
   */
  @cached
  get jexl(): Jexl {
    const documentJexl = new Jexl();

    documentJexl.addTransform("answer", (slug: string, defaultValue: unknown) =>
      this.findAnswer(slug, defaultValue)
    );
    documentJexl.addTransform("mapby", mapby);
    documentJexl.addBinaryOp("intersects", 20, intersects);
    documentJexl.addTransform(
      "debug",
      (unknown: unknown, label: string = "JEXL Debug") => {
        // eslint-disable-next-line no-console
        console.debug(`${label}:`, unknown);
        return unknown;
      }
    );
    documentJexl.addTransform("min", (arr: unknown[]) => {
      const nums = onlyNumbers(arr);
      return nums.length ? Math.min(...nums) : null;
    });
    documentJexl.addTransform("max", (arr: unknown[]) => {
      const nums = onlyNumbers(arr);
      return nums.length ? Math.max(...nums) : null;
    });
    documentJexl.addTransform("round", (num: unknown, places: number = 0) =>
      !onlyNumbers([num]).length
        ? null
        : Math.round((num as number) * Math.pow(10, places)) /
          Math.pow(10, places)
    );
    documentJexl.addTransform("ceil", (num: unknown) =>
      !onlyNumbers([num]).length ? null : Math.ceil(num as number)
    );
    documentJexl.addTransform("floor", (num: unknown) =>
      !onlyNumbers([num]).length ? null : Math.floor(num as number)
    );
    documentJexl.addTransform("sum", (arr: unknown[]) => sum(onlyNumbers(arr)));
    documentJexl.addTransform("avg", (arr: unknown[]) => {
      const nums = onlyNumbers(arr);
      return nums.length ? sum(nums) / nums.length : null;
    });
    documentJexl.addTransform("stringify", (input: unknown) =>
      JSON.stringify(input)
    );

    return documentJexl;
  }

  /**
   * The JEXL context object for passing to the evaluation of jexl expessions
   */
  get jexlContext(): DocumentJexlContext {
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
   */
  @cached
  get flatAnswerMap(): Record<string, unknown> {
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
   */
  findAnswer(slug: string, defaultValue: unknown): unknown {
    const field = this.findField(slug);

    if (!field) {
      if (defaultValue === undefined) {
        throw new Error(`Field for question \`${slug}\` could not be found`);
      }

      return defaultValue;
    }

    if (field.hidden || field.value === undefined || field.value === null) {
      return defaultValue ?? field.question.isMultipleChoice ? [] : null;
    }

    if (field.question.isTable) {
      return (field.value as Document[]).map((doc) =>
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
   */
  findField(slug: string): Field | undefined {
    return [...this.fields, ...(this.parentDocument?.fields ?? [])].find(
      (field) => field.question.slug === slug
    );
  }
}
