import BaseMock from "ember-caluma/mirage-graphql/mocks/base";
import { MockList } from "graphql-tools";
import { Filter, Serializer, register } from "ember-caluma/mirage-graphql";
import { classify } from "@ember/string";

const optionFilter = new Filter("Option");
const optionSerializer = new Serializer("Option");

export default class extends BaseMock {
  @register("Question")
  handleQuestion(root) {
    let questionId =
      root.questionId || (root.node && root.node(...arguments).id);
    let __typename = root.__typename;

    if (questionId) {
      __typename = `${classify(
        this.collection.findBy({ id: questionId }).type.toLowerCase()
      )}Question`;
    }

    return { __typename };
  }

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
  handleTextQuestion() {
    return this.handleInterfaceType(...arguments);
  }

  @register("TextareaQuestion")
  handleTextareaQuestion() {
    return this.handleInterfaceType(...arguments);
  }

  @register("IntegerQuestion")
  handleIntegerQuestion() {
    return this.handleInterfaceType(...arguments);
  }

  @register("FloatQuestion")
  handleFloatQuestion() {
    return this.handleInterfaceType(...arguments);
  }

  @register("MultipleChoiceQuestion")
  handleMultipleChoiceQuestion() {
    return this.handleInterfaceType(...arguments);
  }

  @register("ChoiceQuestion")
  handleChoiceQuestion() {
    return this.handleInterfaceType(...arguments);
  }

  @register("FileQuestion")
  handleFileQuestion() {
    return this.handleInterfaceType(...arguments);
  }

  @register("StaticQuestion")
  handleStaticQuestion() {
    return this.handleInterfaceType(...arguments);
  }

  @register("SaveTextQuestionPayload")
  handleSaveTextQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: { ...input, type: "TEXT" }
    });
  }

  @register("SaveTextareaQuestionPayload")
  handleSaveTextareaQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: { ...input, type: "TEXTAREA" }
    });
  }

  @register("SaveIntegerQuestionPayload")
  handleSaveIntegerQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: { ...input, type: "INTEGER" }
    });
  }

  @register("SaveFloatQuestionPayload")
  handleSaveFloatQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: { ...input, type: "FLOAT" }
    });
  }

  @register("SaveStaticQuestionPayload")
  handleSaveStaticQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: { ...input, type: "STATIC" }
    });
  }

  @register("SaveChoiceQuestionPayload")
  handleSaveChoiceQuestion(_, { input }) {
    const options = input.options.map(slug =>
      optionFilter.find(this.db.options, { slug })
    );
    const optionIds = options.map(({ id }) => String(id));

    const res = this.handleSavePayload.fn.call(this, _, {
      input: { ...input, options, optionIds, type: "CHOICE" }
    });

    Object.assign(res.question, {
      options: {
        edges: () =>
          new MockList(options.length, () => ({
            node: (r, v, _, meta) =>
              optionSerializer.serialize(options[meta.path.prev.key])
          }))
      }
    });

    return res;
  }

  @register("SaveMultipleChoiceQuestionPayload")
  handleSaveMultipleChoiceQuestion(_, { input }) {
    const options = input.options.map(slug =>
      optionFilter.find(this.db.options, { slug })
    );
    const optionIds = options.map(({ id }) => String(id));

    const res = this.handleSavePayload.fn.call(this, _, {
      input: { ...input, options, optionIds, type: "MULTIPLE_CHOICE" }
    });

    Object.assign(res.question, {
      options: {
        edges: () =>
          new MockList(options.length, () => ({
            node: (r, v, _, meta) =>
              optionSerializer.serialize(options[meta.path.prev.key])
          }))
      }
    });

    return res;
  }

  @register("SaveTableQuestionPayload")
  handleSaveTableQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: { ...input, type: "TABLE" }
    });
  }

  @register("SaveFormQuestionPayload")
  handleSaveFormQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: { ...input, type: "FORM" }
    });
  }

  @register("SaveFileQuestionPayload")
  handleSaveFileQuestion(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: { ...input, type: "FILE" }
    });
  }
}
