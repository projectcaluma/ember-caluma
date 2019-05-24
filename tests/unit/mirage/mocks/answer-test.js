import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import { setupMirage } from "ember-cli-mirage/test-support";
import gql from "graphql-tag";

module("Unit | Mirage GraphQL Mock | answer", function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    const { id: formId } = this.server.create("form", { slug: "test-form" });
    const { id: documentId } = this.server.create("document", {
      formId: formId
    });

    const textQuestion = this.server.create("question", {
      type: "TEXT",
      formIds: [formId]
    });
    const textareaQuestion = this.server.create("question", {
      type: "TEXTAREA",
      formIds: [formId]
    });
    const integerQuestion = this.server.create("question", {
      type: "INTEGER",
      formIds: [formId]
    });
    const floatQuestion = this.server.create("question", {
      type: "FLOAT",
      formIds: [formId]
    });
    const multipleChoiceQuestion = this.server.create("question", {
      type: "MULTIPLE_CHOICE",
      formIds: [formId]
    });
    const choiceQuestion = this.server.create("question", {
      type: "CHOICE",
      formIds: [formId]
    });

    this.textAnswer = this.server.create("answer", {
      questionId: textQuestion.id,
      documentId
    });
    this.textareaAnswer = this.server.create("answer", {
      questionId: textareaQuestion.id,
      documentId
    });
    this.integerAnswer = this.server.create("answer", {
      questionId: integerQuestion.id,
      documentId
    });
    this.floatAnswer = this.server.create("answer", {
      questionId: floatQuestion.id,
      documentId
    });
    this.multipleChoiceAnswer = this.server.create("answer", {
      questionId: multipleChoiceQuestion.id,
      documentId
    });
    this.choiceAnswer = this.server.create("answer", {
      questionId: choiceQuestion.id,
      documentId
    });

    this.apollo = this.owner.lookup("service:apollo");
  });

  test("can fetch answers (via documents)", async function(assert) {
    assert.expect(1);

    const res = await this.apollo.query({
      query: gql`
        query {
          allDocuments {
            edges {
              node {
                id
                answers {
                  edges {
                    node {
                      ... on StringAnswer {
                        stringValue: value
                      }
                      ... on IntegerAnswer {
                        integerValue: value
                      }
                      ... on FloatAnswer {
                        floatValue: value
                      }
                      ... on ListAnswer {
                        listValue: value
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `
    });

    assert.deepEqual(res.allDocuments.edges[0].node.answers.edges, [
      {
        __typename: "AnswerEdge",
        node: {
          __typename: "StringAnswer",
          stringValue: this.textAnswer.value
        }
      },
      {
        __typename: "AnswerEdge",
        node: {
          __typename: "StringAnswer",
          stringValue: this.textareaAnswer.value
        }
      },
      {
        __typename: "AnswerEdge",
        node: {
          __typename: "IntegerAnswer",
          integerValue: this.integerAnswer.value
        }
      },
      {
        __typename: "AnswerEdge",
        node: {
          __typename: "FloatAnswer",
          floatValue: this.floatAnswer.value
        }
      },
      {
        __typename: "AnswerEdge",
        node: {
          __typename: "ListAnswer",
          listValue: this.multipleChoiceAnswer.value
        }
      },
      {
        __typename: "AnswerEdge",
        node: {
          __typename: "StringAnswer",
          stringValue: this.choiceAnswer.value
        }
      }
    ]);
  });

  test("can save string answer", async function(assert) {
    assert.expect(1);

    const f = this.server.create("form");
    const q = this.server.create("question", {
      type: "TEXT",
      formIds: [f.id]
    });
    const d = this.server.create("document", { formId: f.id });

    const res = await this.apollo.mutate({
      mutation: gql`
        mutation {
          saveDocumentStringAnswer(
            input: { document: "${d.id}", question: "${q.slug}", value: "Test" }
          ) {
            answer {
              ...on StringAnswer{
                value
              }
              question {
                slug
              }
            }
          }
        }
      `
    });

    assert.deepEqual(res.saveDocumentStringAnswer.answer, {
      value: "Test",
      __typename: "StringAnswer",
      question: {
        slug: q.slug,
        __typename: "TextQuestion"
      }
    });
  });

  test("can save integer answer", async function(assert) {
    assert.expect(1);

    const f = this.server.create("form");
    const q = this.server.create("question", {
      type: "INTEGER",
      formIds: [f.id]
    });
    const d = this.server.create("document", { formId: f.id });

    const res = await this.apollo.mutate({
      mutation: gql`
        mutation {
          saveDocumentIntegerAnswer(
            input: { document: "${d.id}", question: "${q.slug}", value: 5 }
          ) {
            answer {
              ...on IntegerAnswer {
                value
              }
              question {
                slug
              }
            }
          }
        }
      `
    });

    assert.deepEqual(res.saveDocumentIntegerAnswer.answer, {
      value: 5,
      __typename: "IntegerAnswer",
      question: {
        slug: q.slug,
        __typename: "IntegerQuestion"
      }
    });
  });

  test("can save float answer", async function(assert) {
    assert.expect(1);

    const f = this.server.create("form");
    const q = this.server.create("question", {
      type: "FLOAT",
      formIds: [f.id]
    });
    const d = this.server.create("document", { formId: f.id });

    const res = await this.apollo.mutate({
      mutation: gql`
        mutation {
          saveDocumentFloatAnswer(
            input: { document: "${d.id}", question: "${q.slug}", value: 0.5 }
          ) {
            answer {
              ...on FloatAnswer {
                value
              }
              question {
                slug
              }
            }
          }
        }
      `
    });

    assert.deepEqual(res.saveDocumentFloatAnswer.answer, {
      value: 0.5,
      __typename: "FloatAnswer",
      question: {
        slug: q.slug,
        __typename: "FloatQuestion"
      }
    });
  });

  test("can save list answer", async function(assert) {
    assert.expect(1);

    const f = this.server.create("form");
    const q = this.server.create("question", {
      type: "MULTIPLE_CHOICE",
      formIds: [f.id]
    });
    const d = this.server.create("document", { formId: f.id });

    const res = await this.apollo.mutate({
      mutation: gql`
        mutation {
          saveDocumentListAnswer(
            input: {
              document: "${d.id}",
              question: "${q.slug}",
              value: [${q.options.models.map(o => `"${o.slug}"`).join(",")}]
            }
          ) {
            answer {
              ...on ListAnswer {
                value
              }
              question {
                slug
              }
            }
          }
        }
      `
    });

    assert.deepEqual(res.saveDocumentListAnswer.answer, {
      value: q.options.models.map(({ slug }) => slug),
      __typename: "ListAnswer",
      question: {
        slug: q.slug,
        __typename: "MultipleChoiceQuestion"
      }
    });
  });

  test("can update an answer", async function(assert) {
    assert.expect(1);

    const f = this.server.create("form");
    const q = this.server.create("question", {
      type: "MULTIPLE_CHOICE",
      formIds: [f.id]
    });
    const d = this.server.create("document", { formId: f.id });

    this.server.create("answer", {
      questionId: q.id,
      documentId: d.id
    });

    const res = await this.apollo.mutate({
      mutation: gql`
        mutation {
          saveDocumentListAnswer(
            input: {
              document: "${d.id}",
              question: "${q.slug}",
              value: [${q.options.models.map(o => `"${o.slug}"`).join(",")}]
            }
          ) {
            answer {
              ...on ListAnswer {
                value
              }
              question {
                slug
              }
            }
          }
        }
      `
    });

    assert.deepEqual(res.saveDocumentListAnswer.answer, {
      value: q.options.models.map(({ slug }) => slug),
      __typename: "ListAnswer",
      question: {
        slug: q.slug,
        __typename: "MultipleChoiceQuestion"
      }
    });
  });
});
