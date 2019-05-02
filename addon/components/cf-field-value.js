import Component from "@ember/component";
import layout from "../templates/components/cf-field-value";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import getFileAnswerInfoQuery from "ember-caluma/gql/queries/get-fileanswer-info";

export default Component.extend({
  layout,

  apollo: service(),

  tagName: "span",

  value: computed("field.answer.value", function() {
    const field = this.get("field");

    switch (field.question.__typename) {
      case "ChoiceQuestion": {
        const option = field.question.choiceOptions.edges.find(
          edge => edge.node.slug === field.answer.value
        );
        return { label: option ? option.node.label : field.answer.value };
      }
      case "MultipleChoiceQuestion": {
        const answerValue = field.answer.value || [];
        const options = field.question.multipleChoiceOptions.edges.filter(
          edge => answerValue.includes(edge.node.slug)
        );
        return {
          label:
            options && options.length
              ? options.map(edge => edge.node.label).join(", ")
              : answerValue.join(", ")
        };
      }
      case "FileQuestion": {
        const answerValue = field.answer.value;
        return {
          fileAnswerId: answerValue && field.answer.id,
          label: answerValue && answerValue.name
        };
      }

      default:
        return {
          label: field.answer.value
        };
    }
  }),
  actions: {
    async download(fileAnswerId) {
      const { downloadUrl } = await this.apollo.watchQuery(
        {
          query: getFileAnswerInfoQuery,
          variables: { id: fileAnswerId },
          fetchPolicy: "cache-and-network"
        },
        "node.fileValue"
      );
      window.open(downloadUrl, "_blank");
    }
  }
});
