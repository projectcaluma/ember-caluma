import { action } from "@ember/object";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import moment from "moment";

import getFileAnswerInfoQuery from "@projectcaluma/ember-form/gql/queries/fileanswer-info.graphql";

export default class CfFieldValueComponent extends Component {
  @queryManager apollo;

  get value() {
    const field = this.args.field;

    switch (field.questionType) {
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
          fileAnswerId: answerValue && field.answer.raw.id,
          label: answerValue?.name,
        };
      }
      case "DateQuestion": {
        return {
          label: field.answer.value && moment(field.answer.value).format("L"),
        };
      }

      default:
        return { label: field.answer.value };
    }
  }

  @action
  async download(id) {
    const { downloadUrl } = await this.apollo.query(
      { query: getFileAnswerInfoQuery, variables: { id } },
      "node.fileValue"
    );

    window.open(downloadUrl, "_blank");
  }
}
