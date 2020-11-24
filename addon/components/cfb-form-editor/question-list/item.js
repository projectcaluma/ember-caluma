import Component from "@ember/component";
import { computed } from "@ember/object";
import { reads } from "@ember/object/computed";
import { optional } from "ember-composable-helpers/helpers/optional";
import { task } from "ember-concurrency";
import jexl from "jexl";

import layout from "../../../templates/components/cfb-form-editor/question-list/item";

export default Component.extend({
  layout,
  tagName: "li",

  classNameBindings: [
    "question.isArchived:cfb-form-editor__question-list__item__archived",
  ],

  sortable: true,
  slug: reads("question.slug"),
  archived: reads("question.isArchived"),

  required: reads("_required.lastSuccessful.value"),
  _required: computed("_requiredTask", "question.isRequired", function () {
    const tsk = this._requiredTask;
    tsk.perform();
    return tsk;
  }),
  _requiredTask: task(function* () {
    return yield jexl.eval(this.get("question.isRequired"));
  }),

  didInsertElement(...args) {
    this._super(...args);

    optional([this.get("on-register")])(this.elementId, this.slug);
  },

  willDestroyElement(...args) {
    this._super(...args);

    optional([this.get("on-unregister")])(this.elementId, this.slug);
  },
});
