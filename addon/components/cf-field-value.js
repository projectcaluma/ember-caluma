import Component from "@ember/component";
import layout from "../templates/components/cf-field-value";
import { computed } from "@ember/object";

export default Component.extend({
  layout,

  tagName: "span",

  renderValue: computed("field.answer.value", function() {
    const field = this.get("field");

    switch (field.question.__typename) {
      case "ChoiceQuestion": {
        const option = field.question.choiceOptions.edges.find(
          edge => edge.node.slug === field.answer.value
        );
        return option ? option.node.label : field.answer.value;
      }
      case "MultipleChoiceQuestion": {
        const answerValue = field.answer.value || [];
        const options = field.question.multipleChoiceOptions.edges.filter(
          edge => answerValue.includes(edge.node.slug)
        );
        return options && options.length
          ? options.map(edge => edge.node.label).join(", ")
          : answerValue.join(", ");
      }

      default:
        return field.answer.value;
    }
  })
});
