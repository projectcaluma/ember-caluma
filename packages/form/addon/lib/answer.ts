import { getOwner } from "@ember/application";
import { camelize } from "@ember/string";
import { isEmpty } from "@ember/utils";
import { cached, dedupeTracked } from "tracked-toolbox";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import Base from "@projectcaluma/ember-form/lib/base";
import Document from "@projectcaluma/ember-form/lib/document";
import Field from "@projectcaluma/ember-form/lib/field";
import { parseDocument } from "@projectcaluma/ember-form/lib/parsers";

type ValueKey =
  | "stringValue"
  | "integerValue"
  | "floatValue"
  | "listValue"
  | "fileValue"
  | "dateValue"
  | "tableValue";

class DedupedTrackedRawAnswer {
  constructor(obj: RawAnswer) {
    Object.entries(obj).forEach(([key, value]) => {
      Object.defineProperty(this, key, dedupeTracked(this, key, { value }));
    });
  }
}

/**
 * Object which represents an answer in context of a field
 */
export default class Answer extends Base {
  constructor({
    field,
    raw,
    owner,
  }: {
    field: Field;
    raw: RawAnswer;
    owner: unknown;
  }) {
    super({ owner });

    this.raw = new DedupedTrackedRawAnswer(raw) as DedupedTrackedRawAnswer &
      RawAnswer;

    this.field = field;

    this.pushIntoStore();
  }

  /**
   * The field this answer originates from
   */
  readonly field: Field;

  /**
   * The raw data of the answer
   */
  readonly raw: DedupedTrackedRawAnswer & RawAnswer;

  /**
   * The primary key of the answer.
   */
  @cached
  get pk(): string | null {
    return this.uuid && `Answer:${this.uuid}`;
  }

  /**
   * The uuid of the answer
   */
  @cached
  get uuid(): string | null {
    return this.raw.id ? decodeId(this.raw.id) : null;
  }

  /**
   * Whether the answer is new. This is true when there is no object from the
   * backend or the value is empty.
   */
  @cached
  get isNew(): boolean {
    return !this.uuid || isEmpty(this.value);
  }

  /**
   * The name of the property in which the value is stored. This depends on the
   * type of the answer.
   */
  @cached
  private get _valueKey(): ValueKey {
    return camelize(
      this.raw.__typename.replace(/Answer$/, "Value")
    ) as ValueKey;
  }

  /**
   * The value of the answer, the type of this value depends on the type of the
   * answer. For table answers this returns an array of documents.
   */
  @cached
  get value(): AnswerValue {
    const value = this.raw[this._valueKey] as AnswerValue | RawDocument[];

    if (this.raw.__typename === "TableAnswer" && value) {
      const owner = getOwner(this);
      const klass = owner.factoryFor("caluma-model:document").class as Document;

      return (value as RawDocument[]).map((document) => {
        const existing = this.calumaStore.find(
          `Document:${decodeId(document.id)}`
        ) as Document | null;

        return (
          existing ??
          new klass({
            raw: parseDocument(rawDocument),
            parentDocument: this.field.document,
            owner,
          })
        );
      });
    }

    return value as AnswerValue;
  }

  set value(value: AnswerValue | undefined) {
    const parsedValue = value === undefined || value === "" ? null : value;

    this.raw[this._valueKey] = parsedValue;
  }

  /**
   * The value serialized for a backend request.
   */
  get serializedValue(): SerializedAnswerValue {
    if (this.raw.__typename === "TableAnswer") {
      const value = (this.value || []) as Document[];

      return value.map(({ uuid }) => uuid);
    }

    return this.value as SerializedAnswerValue;
  }
}
