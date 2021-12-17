import { register } from "@projectcaluma/ember-testing/mirage-graphql";
import BaseMock from "@projectcaluma/ember-testing/mirage-graphql/mocks/base";

export default class extends BaseMock {
  @register("ReorderFormQuestionsPayload")
  handleReorderFormQuestions(_, { input }) {
    return this.handleSavePayload.fn.call(this, _, {
      input: {
        id: input.form,
        questionIds: input.questions,
      },
    });
  }

  @register("AddFormQuestionPayload")
  handleAddFormQuestion(_, { input }) {
    const form = this.schema.forms.find(input.form);

    return this.handleSavePayload.fn.call(this, _, {
      input: {
        id: form.id,
        questionIds: [...(form.questionIds || []), input.question],
        questions: undefined,
      },
    });
  }

  @register("RemoveFormQuestionPayload")
  handleRemoveFormQuestion(_, { input }) {
    const form = this.schema.forms.find(input.form);

    return this.handleSavePayload.fn.call(this, _, {
      input: {
        id: form.id,
        questionIds: form.questionIds.filter((id) => id !== input.question),
        questions: undefined,
      },
    });
  }
}
