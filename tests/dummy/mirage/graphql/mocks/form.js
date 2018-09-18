import BaseMock from "./base";
import { Serializer, Filter, register } from "..";
import { MockList } from "graphql-tools";

const questionSerializer = new Serializer("Question");
const questionFilter = new Filter("Question");

export default class extends BaseMock {
  @register("ArchiveFormPayload")
  handleArchiveForm(
    _,
    {
      input: { id, clientMutationId }
    }
  ) {
    const form = this.filter.find(
      this.collection,
      this.serializer.deserialize({ id })
    );
    const res = this.collection.update(form.id, { isArchived: true });

    return {
      form: this.serializer.serialize(res),
      clientMutationId
    };
  }

  @register("ReorderFormQuestionsPayload")
  handleReorderFormQuestions(
    root,
    {
      input: { form: formId, questions: questionIds, clientMutationId }
    }
  ) {
    const form = this.filter.find(
      this.collection,
      this.serializer.deserialize({ id: formId })
    );

    const questions = questionIds.map(id => {
      return questionFilter.find(
        this.db.questions,
        questionSerializer.deserialize({ id })
      );
    });

    const res = this.collection.update(form.id, {
      questionIds: questions.map(({ id }) => id)
    });

    return {
      form: {
        ...this.serializer.serialize(res),
        questions: {
          edges: () =>
            new MockList(questions.length, () => ({
              node: (r, v, _, meta) =>
                questionSerializer.serialize(questions[meta.path.prev.key])
            }))
        }
      },
      clientMutationId
    };
  }

  @register("AddFormQuestionPayload")
  handleAddFormQuestion(
    root,
    {
      input: { form: formId, question: questionId, clientMutationId }
    }
  ) {
    const form = this.filter.find(
      this.collection,
      this.serializer.deserialize({ id: formId })
    );

    const question = questionFilter.find(
      this.db.questions,
      questionSerializer.deserialize({ id: questionId })
    );

    this.db.questions.update(question.id, {
      formIds: [...(question.formIds || []), form.id]
    });

    const res = this.collection.update(form.id, {
      questionIds: [...(form.questionIds || []), question.id]
    });

    const questions = res.questionIds.map(id => this.db.questions.find(id));

    return {
      form: {
        ...this.serializer.serialize(res),
        questions: {
          edges: () =>
            new MockList(questions.length, () => ({
              node: (r, v, _, meta) =>
                questionSerializer.serialize(questions[meta.path.prev.key])
            }))
        }
      },
      clientMutationId
    };
  }

  @register("RemoveFormQuestionPayload")
  handleRemoveFormQuestion(
    root,
    {
      input: { form: formId, question: questionId, clientMutationId }
    }
  ) {
    const form = this.filter.find(
      this.collection,
      this.serializer.deserialize({ id: formId })
    );

    const question = questionFilter.find(
      this.db.questions,
      questionSerializer.deserialize({ id: questionId })
    );

    this.db.questions.update(question.id, {
      formIds: (question.formIds || []).filter(id => id !== form.id)
    });

    const res = this.collection.update(form.id, {
      questionIds: (form.questionIds || []).filter(id => id !== question.id)
    });

    const questions = res.questionIds.map(id => this.db.questions.find(id));

    return {
      form: {
        ...this.serializer.serialize(res),
        questions: {
          edges: () =>
            new MockList(questions.length, () => ({
              node: (r, v, _, meta) =>
                questionSerializer.serialize(questions[meta.path.prev.key])
            }))
        }
      },
      clientMutationId
    };
  }
}
