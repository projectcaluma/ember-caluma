import Base from "ember-caluma/lib/base";
import { computed } from "@ember/object";
import { assert } from "@ember/debug";
import { getOwner } from "@ember/application";
import jexl from "jexl";
import { decodeId } from "ember-caluma/helpers/decode-id";
import { intersects } from "ember-caluma/utils/jexl";
import { filterBy } from "@ember/object/computed";

import Fieldset from "ember-caluma/lib/fieldset";

/**
 * Object which represents a document
 *
 * @class Document
 */
export default Base.extend({
  init() {
    this._super(...arguments);

    assert(
      "A GraphQL Document `raw` must be passed",
      this.raw && this.raw.__typename === "Document"
    );

    this.set(
      "fieldsets",
      this.raw.forms.map(form =>
        Fieldset.create(getOwner(this).ownerInjection(), {
          raw: {
            form,
            answers: this.raw.answers
          },
          document: this
        })
      )
    );

    this.fields.forEach(field => {
      field.question.hiddenTask.perform();
      field.question.optionalTask.perform();
    });
  },

  id: computed("raw.id", function() {
    return decodeId(this.get("raw.id"));
  }),

  fields: computed("fieldsets.@each.fields", function() {
    return this.fieldsets.reduce(
      (fields, fieldset) => [...fields, ...fieldset.fields],
      []
    );
  }),

  questionJexl: computed(function() {
    const questionJexl = new jexl.Jexl();

    questionJexl.addTransform("answer", slugWithPath =>
      this.findAnswer(slugWithPath)
    );
    questionJexl.addTransform("mapby", (arr, key) => {
      return arr && arr.map ? arr.map(obj => obj[key]) : null;
    });
    questionJexl.addBinaryOp("intersects", 20, intersects);

    return questionJexl;
  }),

  questionJexlContext: computed("raw.form.slug", function() {
    return {
      form: this.raw.form.slug
    };
  }),

  findAnswer(slugWithPath) {
    const field = this.findField(slugWithPath);
    if (!field || !field.answer) {
      return null;
    }

    // Multiple choice questions should return an empty array if there is no answer
    // otherwise `intersects` operator breaks
    const emptyValue =
      field.question.__typename == "MultipleChoiceQuestion" ? [] : null;

    if (field.answer.value && !field.question.hidden) {
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

  findField(slugWithPath) {
    const segments = slugWithPath.split(".");
    const slug = segments.pop();
    const doc = this.resolveDocument(segments);
    let field = doc && doc.fields.find(field => field.question.slug === slug);
    if (!field) {
      segments.push(slug);
      this._resolveError(segments, slug, doc);
    }
    return field;
  },

  visibleFields: filterBy("fields", "hidden", false)
});
