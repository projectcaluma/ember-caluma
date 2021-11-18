import { MockList } from "graphql-tools";

import {
  Filter,
  register,
  serialize,
} from "@projectcaluma/ember-testing/mirage-graphql";
import BaseMock from "@projectcaluma/ember-testing/mirage-graphql/mocks/base";

const optionFilter = new Filter("Option");

export default class extends BaseMock {
  handleInterfaceType(root, vars, _, meta) {
    return this.handle.fn.call(
      this,
      root,
      { ...vars, id: root.questionId },
      _,
      meta
    );
  }

  @register("TextQuestion")
  handleTextQuestion(...args) {
    return this.handleInterfaceType(...args);
  }

  @register("TextareaQuestion")
  handleTextareaQuestion(...args) {
    return this.handleInterfaceType(...args);
  }

  @register("IntegerQuestion")
  handleIntegerQuestion(...args) {
    return this.handleInterfaceType(...args);
  }

  @register("FloatQuestion")
  handleFloatQuestion(...args) {
    return this.handleInterfaceType(...args);
  }

  @register("MultipleChoiceQuestion")
  handleMultipleChoiceQuestion(...args) {
    return this.handleInterfaceType(...args);
  }

  @register("ChoiceQuestion")
  handleChoiceQuestion(...args) {
    return this.handleInterfaceType(...args);
  }

  @register("FileQuestion")
  handleFileQuestion(...args) {
    return this.handleInterfaceType(...args);
  }

  @register("StaticQuestion")
  handleStaticQuestion(...args) {
    return this.handleInterfaceType(...args);
  }

  @register("DateQuestion")
  handleDateQuestion(...args) {
    return this.handleInterfaceType(...args);
  }

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
    const options = input.options.map((slug) =>
      optionFilter.find(this.db.options, { slug })
    );
    const optionIds = options.map(({ id }) => String(id));

    const res = this.handleSavePayload.fn.call(this, _, {
      input: { ...input, options, optionIds, type: "CHOICE" },
    });

    Object.assign(res.question, {
      options: {
        edges: () =>
          new MockList(options.length, () => ({
            node: (r, v, _, meta) =>
              serialize(options[meta.path.prev.key], "Option"),
          })),
      },
    });

    return res;
  }

  @register("SaveMultipleChoiceQuestionPayload")
  handleSaveMultipleChoiceQuestion(_, { input }) {
    const options = input.options.map((slug) =>
      optionFilter.find(this.db.options, { slug })
    );
    const optionIds = options.map(({ id }) => String(id));

    const res = this.handleSavePayload.fn.call(this, _, {
      input: { ...input, options, optionIds, type: "MULTIPLE_CHOICE" },
    });

    Object.assign(res.question, {
      options: {
        edges: () =>
          new MockList(options.length, () => ({
            node: (r, v, _, meta) =>
              serialize(options[meta.path.prev.key], "Option"),
          })),
      },
    });

    return res;
  }

  @register("SaveTableQuestionPayload")
  handleSaveTableQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: {
        ...input,
        ...(input.rowForm ? { rowForm: { slug: input.rowForm } } : {}),
        type: "TABLE",
      },
    });
  }

  @register("SaveFormQuestionPayload")
  handleSaveFormQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: {
        ...input,
        ...(input.subForm ? { subForm: { slug: input.subForm } } : {}),
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
