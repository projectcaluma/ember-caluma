import { register } from "@projectcaluma/ember-testing/mirage-graphql";
import BaseMock from "@projectcaluma/ember-testing/mirage-graphql/mocks/base";

export default class extends BaseMock {
  @register("SaveTextQuestionPayload")
  handleSaveTextQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: { ...input, type: "TEXT" },
    });
  }

  @register("SaveTextareaQuestionPayload")
  handleSaveTextareaQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: { ...input, type: "TEXTAREA" },
    });
  }

  @register("SaveIntegerQuestionPayload")
  handleSaveIntegerQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: { ...input, type: "INTEGER" },
    });
  }

  @register("SaveFloatQuestionPayload")
  handleSaveFloatQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: { ...input, type: "FLOAT" },
    });
  }

  @register("SaveStaticQuestionPayload")
  handleSaveStaticQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: { ...input, type: "STATIC" },
    });
  }

  @register("SaveChoiceQuestionPayload")
  handleSaveChoiceQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: {
        ...input,
        optionIds: input.options,
        options: undefined,
        type: "CHOICE",
      },
    });
  }

  @register("SaveMultipleChoiceQuestionPayload")
  handleSaveMultipleChoiceQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: {
        ...input,
        optionIds: input.options,
        options: undefined,
        type: "MULTIPLE_CHOICE",
      },
    });
  }

  @register("SaveTableQuestionPayload")
  handleSaveTableQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: {
        ...input,
        rowFormId: input.rowForm,
        rowForm: undefined,
        type: "TABLE",
      },
    });
  }

  @register("SaveFormQuestionPayload")
  handleSaveFormQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: {
        ...input,
        subFormId: input.subForm,
        subForm: undefined,
        type: "FORM",
      },
    });
  }

  @register("SaveDateQuestionPayload")
  handleSaveDateQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: { ...input, type: "DATE" },
    });
  }

  @register("SaveFileQuestionPayload")
  handleSaveFileQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: { ...input, type: "FILE" },
    });
  }
}
