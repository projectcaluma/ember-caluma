import Base from "ember-caluma/lib/base";
import { computed, get, defineProperty } from "@ember/object";
import { assert } from "@ember/debug";
import { getOwner } from "@ember/application";
import { decodeId } from "ember-caluma/helpers/decode-id";
import Form from "ember-caluma/lib/form";
import jexl from "jexl";
import { intersects } from "ember-caluma/utils/jexl";
import { inject as service } from "@ember/service";
import Fieldset from "ember-caluma/lib/fieldset";

/**
 * Object which represents a document
 *
 * @class Document
 */
export default Base.extend({
  calumaStore: service(),

  init() {
    assert(
      "A graphql document `raw` must be passed",
      this.raw && this.raw.__typename === "Document"
    );

    defineProperty(this, "pk", {
      writable: false,
      value: `Document:${decodeId(this.raw.id)}`
    });

    this._super(...arguments);

    this._createRootForm();
    this._createFieldsets();

    this._registerFieldHandlers();
  },

  _createRootForm() {
    const rootForm =
      this.calumaStore.find(`Form:${this.raw.rootForm}`) ||
      Form.create(getOwner(this).ownerInjection(), {
        raw: this.raw.rootForm
      });

    this.set("rootForm", rootForm);
  },

  _createFieldsets() {
    const fieldsets = this.raw.forms.map(form => {
      return (
        this.calumaStore.find(`${this.pk}:Form:${form.slug}`) ||
        Fieldset.create(getOwner(this).ownerInjection(), {
          raw: { form, answers: this.raw.answers },
          document: this
        })
      );
    });

    fieldsets.forEach(fieldset => this.fieldsets.push(fieldset));
  },

  /**
   * The uuid of the document
   *
   * @property {String} uuid
   * @accessor
   */
  uuid: computed("raw.id", function() {
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
  fieldsets: computed(() => []),

  /**
   * All fields of all fieldsets of this document
   *
   * @property {Field[]} fields
   * @accessor
   */
  fields: computed("fieldsets.@each.fields", function() {
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
  jexl: computed(function() {
    const documentJexl = new jexl.Jexl();

    documentJexl.addTransform("answer", slug => this.findAnswer(slug));
    documentJexl.addTransform("mapby", (arr, key) => {
      return Array.isArray(arr) ? arr.map(obj => obj[key]) : null;
    });
    documentJexl.addBinaryOp("intersects", 20, intersects);

    return documentJexl;
  }),

  /**
   * The JEXL context object for passing to the evaluation of jexl expessions
   *
   * @property {Object} jexlContext
   * @accessor
   */
  jexlContext: computed("document.rootForm.slug", function() {
    return { form: this.rootForm.slug };
  }),

  /**
   * Find an answer for a given question slug
   *
   * @param {String} slug The slug of the question to find the answer for
   * @return {*} The answer to the given question
   */
  findAnswer(slug) {
    const field = this.findField(slug);

    if (!field || !field.answer) {
      return null;
    }

    // Multiple choice questions should return an empty array if there is no answer
    // otherwise `intersects` operator breaks
    const emptyValue =
      field.question.__typename == "MultipleChoiceQuestion" ? [] : null;

    if (field.answer.value && !field.hidden) {
      if (field.question.__typename === "TableQuestion") {
        return (field.get("answer.value") || []).map(doc =>
          doc.fields.reduce((obj, field) => {
            return {
              ...obj,
              [field.question.slug]: field.answer.value
            };
          }, {})
        );
      }
      return field.answer.value;
    }

    return emptyValue;
  },

  /**
   * Find a field in the document by a given question slug
   *
   * @param {String} slug The slug of the wanted field
   * @return {Field} The wanted field
   */
  findField(slug) {
    return this.fields.find(field => field.question.slug === slug);
  },

  /**
   * Register update handlers for all fields on the document
   *
   * @method _registerFieldHandlers
   * @private
   */
  _registerFieldHandlers() {
    this.fields.forEach(field => {
      // validate all expressions
      field._validateExpressions();

      // initialize hidden and optional state
      field.hiddenTask.perform();
      field.optionalTask.perform();

      // add handler for visibility and value changes which reruns hidden and
      // optional states of fields that depend on the changed field
      const refreshDependents = () => {
        const hiddenDependents = this.fields.filter(f =>
          f.hiddenDependencies.includes(field.question.slug)
        );

        const optionalDependents = this.fields.filter(f =>
          f.optionalDependencies.includes(field.question.slug)
        );

        hiddenDependents.forEach(f => f.hiddenTask.perform());
        optionalDependents.forEach(f => f.optionalTask.perform());
      };

      // if the field is a form question, the fields of the linked fieldset must
      // be updated when the field's hidden state changes
      const refreshFieldset = () => {
        const fieldsets = this.fieldsets.filter(
          fs => fs.form.slug === get(field, "question.subForm.slug")
        );

        fieldsets.forEach(fs =>
          fs.fields.forEach(f => {
            f.hiddenTask.perform();
            f.optionalTask.perform();
          })
        );
      };

      field.on("hiddenChanged", () => {
        refreshDependents();
        refreshFieldset();
      });

      if (field.answer) {
        // there are fields without an answer (e.g static or form questions)
        field.answer.on("valueChanged", () => {
          refreshDependents();
        });
      }
    });
  }
});
