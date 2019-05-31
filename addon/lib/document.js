import EmberObject, { computed } from "@ember/object";
import { assert } from "@ember/debug";
import { getOwner } from "@ember/application";
import Field from "ember-caluma/lib/field";
import jexl from "jexl";
import { decodeId } from "ember-caluma/helpers/decode-id";
import { inject as service } from "@ember/service";
import { intersects } from "ember-caluma/utils/jexl";
import { filterBy } from "@ember/object/computed";

const getParentState = childStates => {
  if (childStates.every(state => state === "untouched")) {
    return "untouched";
  }

  if (childStates.some(state => state === "invalid")) {
    return "invalid";
  }

  return childStates.every(state => state === "valid") ? "valid" : "unfinished";
};

/**
 * Object which represents a document
 *
 * @class Document
 */
export default EmberObject.extend({
  documentStore: service(),

  async init() {
    this._super(...arguments);

    assert("The raw document `raw` must be passed", this.raw);

    const fields = this.buildFields(this.raw);
    fields.forEach(field => this.fields.push(field));

    // automatic initialization of dynamic fields starts from the root level
    if (!this.get("parentDocument")) {
      await this.initializeFieldTree(fields);
    }
  },

  async initializeFieldTree(fields) {
    for (let field of fields) {
      await field.question.initDynamicFields();
      if (field.childDocument) {
        await this.initializeFieldTree(field.childDocument.fields);
      }
    }
  },

  buildFields(rawDocument) {
    return rawDocument.form.questions.edges.map(({ node: question }) => {
      const answer = rawDocument.answers.edges.find(({ node: answer }) => {
        return answer.question.slug === question.slug;
      });

      let childDocument;
      if (question.__typename === "FormQuestion" && answer) {
        childDocument = this.documentStore.find(answer.node.formValue, {
          parentDocument: this
        });
      }

      return Field.create(getOwner(this).ownerInjection(), {
        document: this,
        _question: question,
        _answer: answer && answer.node,
        childDocument
      });
    });
  },

  id: computed("raw.id", function() {
    return decodeId(this.get("raw.id"));
  }),

  field: computed(
    "raw.form.slug",
    "parentDocument.{id,fields.@each.id}",
    function() {
      if (!this.parentDocument) return null;

      try {
        return this.parentDocument.fields.find(
          field =>
            field.id ===
            `Document:${this.parentDocument.id}:Question:${this.raw.form.slug}`
        );
      } catch (e) {
        return null;
      }
    }
  ),

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
        return field.getWithDefault("answer.rowDocuments", []).map(doc =>
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

  _resolveError(segments, failedAtSegment, failedAtDoc) {
    let path = segments.join(".");
    let explanation = "";
    let availableKeys = failedAtDoc.fields
      .map(field => field.question.slug)
      .map(slug => `"${slug}"`)
      .join(", ");

    if (path != failedAtSegment) {
      // single quesiton, doesn't need explanation about path / segment step
      explanation = ` (failed at segment "${failedAtSegment}")`;
    }
    throw new Error(
      `Question could not be resolved: "${path}"${explanation}. Available: ${availableKeys}`
    );
  },
  resolveDocument(segments) {
    if (!segments) {
      return this;
    }
    let _document = this;
    for (let segment of segments) {
      switch (segment) {
        case "root":
          while (_document.parentDocument) {
            _document = _document.parentDocument;
          }
          break;
        case "parent":
          if (!_document.parentDocument) {
            this._resolveError(segments, segment, _document);
          }
          _document = _document.parentDocument;
          break;
        default: {
          let formField = _document.fields.find(
            field => field.question.slug === segment
          );
          if (!formField) {
            this._resolveError(segments, segment, _document);
          }
          _document = formField.childDocument;
        }
      }
    }
    return _document;
  },

  fields: computed(() => []).readOnly(),

  visibleFields: filterBy("fields", "hidden", false),

  childDocuments: computed(
    "fields.{[],@each.hidden,childDocument}",
    function() {
      return this.fields
        .filter(field => !field.hidden)
        .map(field => field.childDocument)
        .filter(Boolean);
    }
  ),

  childState: computed("childDocuments.{[],@each.state}", function() {
    const childDocumentStates = this.childDocuments
      .filter(Boolean)
      .map(c => c.state);

    if (!childDocumentStates.length) {
      return null;
    }

    return getParentState(childDocumentStates);
  }),

  ownState: computed(
    "fields.@each.{isNew,isValid,hidden,optional,childDocument}",
    function() {
      const visibleFields = this.fields
        .filter(f => !f.hidden)
        .filter(f => !f.childDocument);

      if (!visibleFields.length) {
        return null;
      }

      if (visibleFields.every(f => f.isNew)) {
        return "untouched";
      }

      if (visibleFields.some(f => !f.isValid && !f.isNew)) {
        return "invalid";
      }

      if (
        visibleFields
          .filter(f => !f.question.optional)
          .every(f => f.isValid && !f.isNew)
      ) {
        return "valid";
      }

      return "unfinished";
    }
  ),

  state: computed("childState", "ownState", function() {
    return getParentState([this.childState, this.ownState].filter(Boolean));
  })
});
