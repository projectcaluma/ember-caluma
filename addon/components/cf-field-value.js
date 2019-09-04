import moment from "moment";
import Component from "@ember/component";
import layout from "../templates/components/cf-field-value";
import { computed } from "@ember/object";
import { camelize } from "@ember/string";
import { queryManager } from "ember-apollo-client";
import getFileAnswerInfoQuery from "ember-caluma/gql/queries/get-fileanswer-info";

function getOptionKey(questionType) {
  return `${camelize(questionType.replace(/Question$/, ""))}Options`;
}

export default Component.extend({
  layout,

  apollo: queryManager(),

  tagName: "span",

  value: computed("field.answer.value", function() {
    const field = this.get("field");
    const options = field.question[getOptionKey(field.question.__typename)];

    switch (field.question.__typename) {
      case "ChoiceQuestion":
      case "DynamicChoiceQuestion": {
        const option = options.edges.find(
          edge => edge.node.slug === field.answer.value
        );
        return { label: option ? option.node.label : field.answer.value };
      }
      case "MultipleChoiceQuestion":
      case "DynamicMultipleChoiceQuestion": {
        const answerValue = field.answer.value || [];
        const selectedOptions = options.edges.filter(edge =>
          answerValue.includes(edge.node.slug)
        );
        return {
          label:
            selectedOptions && selectedOptions.length
              ? selectedOptions.map(edge => edge.node.label).join(", ")
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
      case "DateQuestion": {
        return {
          label: field.answer.value && moment(field.answer.value).format("L")
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
