import moment from "moment";

import { register } from "@projectcaluma/ember-testing/mirage-graphql";
import BaseMock from "@projectcaluma/ember-testing/mirage-graphql/mocks/base";

export default class extends BaseMock {
  _handleSaveDocumentAnswer(
    _,
    { question: questionId, document: documentId, value, type }
  ) {
    const answer = this.collection.findBy({ questionId, documentId });

    return this.handleSavePayload.fn.call(this, _, {
      input: {
        id: answer?.id,
        type,
        value,
        documentId,
        questionId,
      },
    });
  }

  @register("SaveDocumentStringAnswerPayload")
  @register("SaveDefaultStringAnswerPayload")
  handleSaveDocumentStringAnswer(_, { input }) {
    return this._handleSaveDocumentAnswer(_, {
      ...input,
      value: input.value ? String(input.value) : null,
      type: "STRING",
    });
  }

  @register("SaveDocumentIntegerAnswerPayload")
  @register("SaveDefaultIntegerAnswerPayload")
  handleSaveIntegerAnswer(_, { input }) {
    return this._handleSaveDocumentAnswer(_, {
      ...input,
      value: input.value ? parseInt(input.value) : null,
      type: "INTEGER",
    });
  }

  @register("SaveDocumentFloatAnswerPayload")
  @register("SaveDefaultFloatAnswerPayload")
  handleSaveFloatAnswer(_, { input }) {
    return this._handleSaveDocumentAnswer(_, {
      ...input,
      value: input.value ? parseFloat(input.value) : null,
      type: "FLOAT",
    });
  }

  @register("SaveDocumentListAnswerPayload")
  @register("SaveDefaultListAnswerPayload")
  handleSaveListAnswer(_, { input }) {
    return this._handleSaveDocumentAnswer(_, {
      ...input,
      value: input.value ? [...input.value].map(String) : null,
      type: "LIST",
    });
  }

  @register("SaveDocumentFileAnswerPayload")
  handleSaveFileAnswer(_, { input }) {
    return this._handleSaveDocumentAnswer(_, {
      ...input,
      value: input.value ? { metadata: { object_name: input.value } } : null,
      type: "FILE",
    });
  }

  @register("SaveDocumentDateAnswerPayload")
  @register("SaveDefaultDateAnswerPayload")
  handleSaveDateAnswer(_, { input }) {
    const date = input.value;
    const value = date
      ? moment({
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        }).format(moment.HTML5_FMT.DATE)
      : null;

    return this._handleSaveDocumentAnswer(_, {
      ...input,
      value,
      type: "DATE",
    });
  }
}
