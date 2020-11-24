import Component from "@ember/component";
import { computed } from "@ember/object";
import { queryManager } from "ember-apollo-client";
import moment from "moment";

import layout from "../templates/components/cf-field-value";

import getFileAnswerInfoQuery from "ember-caluma/gql/queries/get-fileanswer-info";

export default Component.extend({
  layout,

  apollo: queryManager(),

  tagName: "span",

  value: computed("field.{selected,answer.value}", function () {
    const field = this.field;

    switch (field.question.__typename) {
      case "ChoiceQuestion":
      case "DynamicChoiceQuestion": {
        return field.selected;
      }
      case "MultipleChoiceQuestion":
      case "DynamicMultipleChoiceQuestion": {
        return { label: field.selected.map(({ label }) => label).join(", ") };
      }
      case "FileQuestion": {
        const answerValue = field.answer.value;
        return {
          fileAnswerId: answerValue && field.answer.id,
          label: answerValue && answerValue.name,
        };
      }
      case "DateQuestion": {
        return {
          label: field.answer.value && moment(field.answer.value).format("L"),
        };
      }

      default:
        return {
          label: field.answer.value,
        };
    }
  }),

  actions: {
    async download(fileAnswerId) {
      const { downloadUrl } = await this.apollo.watchQuery(
        {
          query: getFileAnswerInfoQuery,
          variables: { id: fileAnswerId },
          fetchPolicy: "cache-and-network",
        },
        "node.fileValue"
      );
      window.open(downloadUrl, "_blank");
    },
  },
});
