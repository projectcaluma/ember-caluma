import { getOwner } from "@ember/application";
import { assert } from "@ember/debug";
import { camelize } from "@ember/string";
import { isEmpty } from "@ember/utils";
import { dedupeTracked, cached } from "tracked-toolbox";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import Base from "@projectcaluma/ember-form/lib/base";
import { parseDocument } from "@projectcaluma/ember-form/lib/parsers";

/**
 * Class that automatically defines all keys of the passed object as deduped
 * tracked property and assigns the initial value.
 *
 * @class DedupedTrackedObject
 * @private
 */
class DedupedTrackedObject {
  constructor(obj) {
    Object.entries(obj).forEach(([key, value]) => {
      Object.defineProperty(
        this,
        key,
        dedupeTracked(this, key, { initializer: () => value })
      );
    });
  }
}

/**
 * Object which represents an answer in context of a field
 *
 * @class Answer
 */
export default class Answer extends Base {
  constructor({ raw, field, ...args }) {
    assert("`field` must be passed as an argument", field);

    assert(
      "A graphql answer `raw` must be passed",
      /Answer$/.test(raw?.__typename)
    );

    super({ raw, ...args });

    this.field = field;
    this.raw = new DedupedTrackedObject(raw);

    this.pushIntoStore();
  }

  /**
   * The field this answer originates from
   *
   * @property {Field} field
   */
  field = null;

  /**
   * The raw data of the answer. This is the only `raw` property that is tracked
   * since only the answers properties are changed while rendering the form.
   *
   * @property {DedupedTrackedObject} raw
   */
  raw = {};

  /**
   * The primary key of the answer.
   *
   * @property {String} pk
   */
  @cached
  get pk() {
    return this.uuid && `Answer:${this.uuid}`;
  }

  /**
   * The uuid of the answer
   *
   * @property {String} uuid
   */
  @cached
  get uuid() {
    return this.raw.id ? decodeId(this.raw.id) : null;
  }

  /**
   * Whether the answer is new. This is true when there is no object from the
   * backend or the value is empty.
   *
   * @property {Boolean} isNew
   */
  @cached
  get isNew() {
    return !this.uuid || isEmpty(this.value);
  }

  /**
   * The name of the property in which the value is stored. This depends on the
   * type of the answer.
   *
   * @property {String} _valueKey
   * @private
   */
  @cached
  get _valueKey() {
    return (
      this.raw.__typename &&
      camelize(this.raw.__typename.replace(/Answer$/, "Value"))
    );
  }

  /**
   * The value of the answer, the type of this value depends on the type of the
   * answer. For table answers this returns an array of documents.
   *
   * @property {String|Number|String[]|Document[]} value
   */
  @cached
  get value() {
    const value = this.raw[this._valueKey];

    if (this._valueKey === "tableValue" && value) {
      const owner = getOwner(this);
      const Document = owner.factoryFor("caluma-model:document").class;

      return value.map((document) => {
        if (document instanceof Document) return document;

        const existing = this.calumaStore.find(
          `Document:${decodeId(document.id)}`
        );

        return (
          existing ||
          new Document({
            raw: parseDocument(document),
            parentDocument: this.field.document,
            owner,
          })
        );
      });
    }

    return value;
  }

  set value(value) {
    if (this._valueKey) {
      this.raw[this._valueKey] = [undefined, ""].includes(value) ? null : value;
    }
  }

  /**
   * The value serialized for a backend request.
   *
   * @property {String|Number|String[]} serializedValue
   */
  get serializedValue() {
    if (this.raw.__typename === "TableAnswer") {
      return (this.value || []).map(({ uuid }) => uuid);
    }

    return this.value;
  }
}
