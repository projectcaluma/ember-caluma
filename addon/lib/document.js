import EmberObject, { computed } from "@ember/object";
import { assert } from "@ember/debug";
import { getOwner } from "@ember/application";
import Evented, { on } from "@ember/object/evented";
import Field from "ember-caluma/lib/field";
import jexl from "jexl";
import { atob } from "ember-caluma/helpers/atob";

/**
 * Object which represents a document
 *
 * @class Document
 */
export default EmberObject.extend(Evented, {
  async init() {
    this._super(...arguments);

    assert("The raw document `raw` must be passed", this.raw);

    const fields = this.raw.form.questions.edges.map(({ node: question }) => {
      const answer = this.raw.answers.edges.find(({ node: answer }) => {
        return answer.question.slug === question.slug;
      });

      return Field.create(getOwner(this).ownerInjection(), {
        document: this,
        _question: question,
        _answer: answer && answer.node
      });
    });

    fields.forEach(field => this.fields.push(field));

    for (let field of fields) {
      await field.question.initDynamicFields();
    }
  },

  id: computed("raw.id", function() {
    return atob(this.get("raw.id"));
  }),

  questionJexl: computed(function() {
    const questionJexl = new jexl.Jexl();

    questionJexl.addTransform(
      "answer",
      slug =>
        this.fields.find(field => field.question.slug === slug).answer.value
    );

    return questionJexl;
  }),

  fields: computed(() => []).readOnly(),

  state: computed(
    "fields.@each.{isNew,isValid,_errors,question.hidden}",
    function() {
      console.log("recomputing document state");
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

  updateHidden: on("valueChanged", "hiddenChanged", function(slug) {
    const dependentFields = this.fields.filter(field =>
      field.question.dependsOn.includes(slug)
    );
    console.log("updating dependent fields: ", dependentFields);

    // update hidden state of those fields
    dependentFields.forEach(field => field.question.hiddenTask.perform());
  })
});
