import { DateTime } from "luxon";

import BaseMock from "@projectcaluma/ember-testing/mirage-graphql/mocks/base";
import register from "@projectcaluma/ember-testing/mirage-graphql/register";

export default class AnswerMock extends BaseMock {
  _handleSaveDocumentAnswer(
    _,
    { question: questionId, document: documentId, value, type },
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

  @register("SaveDocumentFilesAnswerPayload")
  handleSaveFilesAnswer(_, { input }) {
    return this._handleSaveDocumentAnswer(_, {
      ...input,
      value: input.value ? [...input.value] : [],
      type: "FILES",
    });
  }

  @register("SaveDocumentDateAnswerPayload")
  @register("SaveDefaultDateAnswerPayload")
  handleSaveDateAnswer(_, { input }) {
    const date = input.value;
    const value = date ? DateTime.fromJSDate(date).toISODate() : null;

    return this._handleSaveDocumentAnswer(_, {
      ...input,
      value,
      type: "DATE",
    });
  }
}
