import Component from "@ember/component";
import layout from "../templates/components/cf-navigation-item";
import { computed } from "@ember/object";

export default Component.extend({
  tagName: "",
  layout,

  section: null,
  subSection: null,

  _subSection: computed(
    "subSection",
    "field.childDocument.fields.@each.hidden",
    function() {
      if (
        !this.get("subSection") &&
        !this.getWithDefault("field.childDocument.fields", []).some(
          f => f.get("question.__typename") !== "FormQuestion"
        )
      ) {
        const target = this.get("field.childDocument.fields").find(
          field => field.hidden === false
        );
        return target && target.question.slug;
      }
      return this.get("subSection");
    }
  )
});
