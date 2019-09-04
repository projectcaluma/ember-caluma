import Component from "@ember/component";
import layout from "../../../templates/components/cfb-form-editor/question-list/item";
import { optional } from "ember-composable-helpers/helpers/optional";
import { reads } from "@ember/object/computed";
import { task } from "ember-concurrency";
import jexl from "jexl";
import { computed } from "@ember/object";

export default Component.extend({
  layout,
  tagName: "li",

  classNameBindings: [
    "question.isArchived:cfb-form-editor__question-list__item__archived"
  ],

  sortable: true,
  slug: reads("question.slug"),
  archived: reads("question.isArchived"),

  required: reads("_required.lastSuccessful.value"),
  _required: computed("question.isRequired", function() {
    const tsk = this.get("_requiredTask");
    tsk.perform();
    return tsk;
  }),
  _requiredTask: task(function*() {
    return yield jexl.eval(this.get("question.isRequired"));
  }),

  didInsertElement() {
    this._super(...arguments);

    optional([this.get("on-register")])(
      this.get("elementId"),
      this.get("slug")
    );
  },

  willDestroyElement() {
    this._super(...arguments);

    optional([this.get("on-unregister")])(
      this.get("elementId"),
      this.get("slug")
    );
  }
});
