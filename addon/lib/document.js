import EmberObject, { computed } from "@ember/object";
import { assert } from "@ember/debug";
import { getOwner } from "@ember/application";
import Field from "ember-caluma/lib/field";
import jexl from "jexl";
import { atob } from "ember-caluma/helpers/atob";
import { inject as service } from "@ember/service";
// import { findFieldInTree } from "ember-caluma/utils/tree";

const STATE_PRECEDENCE = ["invalid", "unfinished", "untouched", "valid"];

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
      this.initializeFieldTree(fields);
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
    return atob(this.get("raw.id"));
  }),

  questionJexl: computed(function() {
    const questionJexl = new jexl.Jexl();

    questionJexl.addTransform("answer", (slug, path) =>
      this.findAnswer(slug, path)
    );

    return questionJexl;
  }),

  findAnswer(slug, path) {
    const result = this.findField(slug, path);
    return result && result.answer.value;
  },

  findField(slug, path) {
    const doc = this.resolveDocument(path);
    return doc && doc.fields.find(field => field.question.slug === slug);
  },

  resolveDocument(path) {
    if (!path) {
      return this;
    }
    let _document = this;
    const parts = path.split(".");
    for (let part of parts) {
      if (part === "parent") {
        _document = _document.parentDocument;
      } else {
        const formField = _document.fields.find(
          field => field.question.slug === part
        );
        if (!formField) {
          return null;
        }
        _document = formField.childDocument;
      }
    }
    return _document;
  },

  fields: computed(() => []).readOnly(),

  childDocuments: computed("fields.[]", function() {
    return this.get("fields")
      .map(field => field.childDocument)
      .filter(Boolean);
  }),

  childState: computed(
    "fields.@each.{isNew,isValid,_errors,question}",
    "childDocuments.@each.state",
    function() {
      const childDocumentStates = this.get("childDocuments")
        .filter(Boolean)
        .map(c => c.state);

      return STATE_PRECEDENCE.find(state =>
        childDocumentStates.includes(state)
      );
    }
  ),

  ownState: computed(
    "fields.@each.{isNew,isValid,_errors,question,childDocument}",
    function() {
      if (this.fields.every(f => f.isNew)) {
        return "untouched";
      }

      const visibleFields = this.fields.filter(f => !f.question.hidden);
      if (visibleFields.every(f => f.isValid)) {
        return "valid";
      }

      return visibleFields.some(f => f._errors.some(e => e.type !== "blank"))
        ? "invalid"
        : "unfinished";
    }
  ),

  state: computed("childState", "ownState", function() {
    return STATE_PRECEDENCE.find(state =>
      [this.get("childState"), this.get("ownState")].includes(state)
    );
  })
});
