import { setupMirage } from "ember-cli-mirage/test-support";
import { setupTest } from "ember-qunit";
import gql from "graphql-tag";
import { module, test } from "qunit";

module("Unit | Mirage GraphQL Mock | question", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const form = this.server.create("form", { slug: "test-form" });

    this.server.create("question", {
      slug: "archived-question",
      type: "TEXT",
      isArchived: true,
    });

    this.server.create("question", {
      slug: "search-question",
      type: "TEXT",
      label: "Blabla",
    });

    this.server.create("question", {
      slug: "exclude-form-question",
      type: "TEXT",
      formIds: [form.id],
    });

    this.apollo = this.owner.lookup("service:apollo");
  });

  test("can fetch questions", async function (assert) {
    assert.expect(1);

    const res = await this.apollo.query({
      query: gql`
        query {
          allQuestions {
            edges {
              node {
                slug
              }
            }
          }
        }
      `,
    });

    assert.deepEqual(res.allQuestions.edges, [
      {
        __typename: "QuestionEdge",
        node: {
          __typename: "TextQuestion",
          slug: "archived-question",
        },
      },
      {
        __typename: "QuestionEdge",
        node: {
          __typename: "TextQuestion",
          slug: "search-question",
        },
      },
      {
        __typename: "QuestionEdge",
        node: {
          __typename: "TextQuestion",
          slug: "exclude-form-question",
        },
      },
    ]);
  });

  test("can filter archived questions", async function (assert) {
    assert.expect(1);

    const res = await this.apollo.query({
      query: gql`
        query {
          allQuestions(isArchived: true) {
            edges {
              node {
                slug
              }
            }
          }
        }
      `,
    });

    assert.deepEqual(res.allQuestions.edges, [
      {
        __typename: "QuestionEdge",
        node: {
          __typename: "TextQuestion",
          slug: "archived-question",
        },
      },
    ]);
  });

  test("can search questions", async function (assert) {
    assert.expect(1);

    const res = await this.apollo.query({
      query: gql`
        query {
          allQuestions(search: "Blabla") {
            edges {
              node {
                slug
              }
            }
          }
        }
      `,
    });

    assert.deepEqual(res.allQuestions.edges, [
      {
        __typename: "QuestionEdge",
        node: {
          __typename: "TextQuestion",
          slug: "search-question",
        },
      },
    ]);
  });

  test("can exclude questions of a certain form", async function (assert) {
    assert.expect(1);

    const res = await this.apollo.query({
      query: gql`
        query Questions($excludeForms: [ID]) {
          allQuestions(excludeForms: $excludeForms) {
            edges {
              node {
                slug
              }
            }
          }
        }
      `,
      variables: { excludeForms: ["test-form"] },
    });

    assert.deepEqual(res.allQuestions.edges, [
      {
        __typename: "QuestionEdge",
        node: {
          __typename: "TextQuestion",
          slug: "archived-question",
        },
      },
      {
        __typename: "QuestionEdge",
        node: {
          __typename: "TextQuestion",
          slug: "search-question",
        },
      },
    ]);
  });

  test("can add text question", async function (assert) {
    assert.expect(1);

    const res = await this.apollo.mutate({
      mutation: gql`
        mutation {
          saveTextQuestion(
            input: { slug: "test-question", label: "Test Question" }
          ) {
            question {
              slug
              label
            }
          }
        }
      `,
    });

    assert.deepEqual(res.saveTextQuestion.question, {
      __typename: "TextQuestion",
      slug: "test-question",
      label: "Test Question",
    });
  });

  test("can add textarea question", async function (assert) {
    assert.expect(1);

    const res = await this.apollo.mutate({
      mutation: gql`
        mutation {
          saveTextareaQuestion(
            input: { slug: "test-question", label: "Test Question" }
          ) {
            question {
              slug
              label
            }
          }
        }
      `,
    });

    assert.deepEqual(res.saveTextareaQuestion.question, {
      __typename: "TextareaQuestion",
      slug: "test-question",
      label: "Test Question",
    });
  });

  test("can add integer question", async function (assert) {
    assert.expect(1);

    const res = await this.apollo.mutate({
      mutation: gql`
        mutation {
          saveIntegerQuestion(
            input: { slug: "test-question", label: "Test Question" }
          ) {
            question {
              slug
              label
            }
          }
        }
      `,
    });

    assert.deepEqual(res.saveIntegerQuestion.question, {
      __typename: "IntegerQuestion",
      slug: "test-question",
      label: "Test Question",
    });
  });

  test("can add float question", async function (assert) {
    assert.expect(1);

    const res = await this.apollo.mutate({
      mutation: gql`
        mutation {
          saveFloatQuestion(
            input: { slug: "test-question", label: "Test Question" }
          ) {
            question {
              slug
              label
            }
          }
        }
      `,
    });

    assert.deepEqual(res.saveFloatQuestion.question, {
      __typename: "FloatQuestion",
      slug: "test-question",
      label: "Test Question",
    });
  });

  test("can add radio question", async function (assert) {
    assert.expect(1);

    const options = this.server.createList("option", 5);

    const res = await this.apollo.mutate({
      mutation: gql`
        mutation {
          saveChoiceQuestion(
            input: {
              slug: "test-question",
              label: "Test Question",
              options: ${JSON.stringify(options.map(({ slug }) => slug))}
            }
          ) {
            question {
              slug
              label
              ... on ChoiceQuestion {
                options {
                  edges {
                    node {
                      slug
                    }
                  }
                }
              }
            }
          }
        }
      `,
    });

    assert.deepEqual(res.saveChoiceQuestion.question, {
      __typename: "ChoiceQuestion",
      slug: "test-question",
      label: "Test Question",
      options: {
        __typename: "OptionConnection",
        edges: options.map(({ slug }) => ({
          __typename: "OptionEdge",
          node: {
            __typename: "Option",
            slug,
          },
        })),
      },
    });
  });

  test("can add checkbox question", async function (assert) {
    assert.expect(1);

    const options = this.server.createList("option", 5);

    const res = await this.apollo.mutate({
      mutation: gql`
        mutation {
          saveMultipleChoiceQuestion(
            input: {
              slug: "test-question",
              label: "Test Question",
              options: ${JSON.stringify(options.map(({ slug }) => slug))}
            }
          ) {
            question {
              slug
              label
              ... on MultipleChoiceQuestion {
                options {
                  edges {
                    node {
                      slug
                    }
                  }
                }
              }
            }
          }
        }
      `,
    });

    assert.deepEqual(res.saveMultipleChoiceQuestion.question, {
      __typename: "MultipleChoiceQuestion",
      slug: "test-question",
      label: "Test Question",

      options: {
        __typename: "OptionConnection",
        edges: options.map(({ slug }) => ({
          __typename: "OptionEdge",
          node: {
            __typename: "Option",
            slug,
          },
        })),
      },
    });
  });

  test("can fetch questions via form and answers", async function (assert) {
    assert.expect(2);

    const form = this.server.create("form");

    const textQuestion = this.server.create("question", {
      type: "TEXT",
      formIds: [form.id],
    });
    const textareaQuestion = this.server.create("question", {
      type: "TEXTAREA",
      formIds: [form.id],
    });
    const integerQuestion = this.server.create("question", {
      type: "INTEGER",
      formIds: [form.id],
    });
    const floatQuestion = this.server.create("question", {
      type: "FLOAT",
      formIds: [form.id],
    });
    const checkboxQuestion = this.server.create("question", {
      type: "MULTIPLE_CHOICE",
      formIds: [form.id],
    });
    const radioQuestion = this.server.create("question", {
      type: "CHOICE",
      formIds: [form.id],
    });
    this.server.create("question", {
      type: "TABLE",
      formIds: [form.id],
    });

    const document = this.server.create("document", { formId: form.id });

    this.server.create("answer", {
      documentId: document.id,
      questionId: textQuestion.id,
    });
    this.server.create("answer", {
      documentId: document.id,
      questionId: textareaQuestion.id,
    });
    this.server.create("answer", {
      documentId: document.id,
      questionId: integerQuestion.id,
    });
    this.server.create("answer", {
      documentId: document.id,
      questionId: floatQuestion.id,
    });
    this.server.create("answer", {
      documentId: document.id,
      questionId: checkboxQuestion.id,
    });
    this.server.create("answer", {
      documentId: document.id,
      questionId: radioQuestion.id,
    });

    const res = await this.apollo.query({
      query: gql`
        query ($id: ID!) {
          allDocuments(id: $id) {
            edges {
              node {
                answers {
                  edges {
                    node {
                      question {
                        slug
                      }
                    }
                  }
                }
                form {
                  slug
                  questions {
                    edges {
                      node {
                        slug
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        id: document.id,
      },
    });

    assert.deepEqual(res.allDocuments.edges[0].node.answers.edges, [
      {
        __typename: "AnswerEdge",
        node: {
          __typename: "StringAnswer",
          question: {
            __typename: "TextQuestion",
            slug: "question-4",
          },
        },
      },
      {
        __typename: "AnswerEdge",
        node: {
          __typename: "StringAnswer",
          question: {
            __typename: "TextareaQuestion",
            slug: "question-5",
          },
        },
      },
      {
        __typename: "AnswerEdge",
        node: {
          __typename: "IntegerAnswer",
          question: {
            __typename: "IntegerQuestion",
            slug: "question-6",
          },
        },
      },
      {
        __typename: "AnswerEdge",
        node: {
          __typename: "FloatAnswer",
          question: {
            __typename: "FloatQuestion",
            slug: "question-7",
          },
        },
      },
      {
        __typename: "AnswerEdge",
        node: {
          __typename: "ListAnswer",
          question: {
            __typename: "MultipleChoiceQuestion",
            slug: "question-8",
          },
        },
      },
      {
        __typename: "AnswerEdge",
        node: {
          __typename: "StringAnswer",
          question: {
            __typename: "ChoiceQuestion",
            slug: "question-9",
          },
        },
      },
    ]);

    assert.deepEqual(res.allDocuments.edges[0].node.form.questions.edges, [
      {
        __typename: "QuestionEdge",
        node: {
          __typename: "TextQuestion",
          slug: "question-4",
        },
      },
      {
        __typename: "QuestionEdge",
        node: {
          __typename: "TextareaQuestion",
          slug: "question-5",
        },
      },
      {
        __typename: "QuestionEdge",
        node: {
          __typename: "IntegerQuestion",
          slug: "question-6",
        },
      },
      {
        __typename: "QuestionEdge",
        node: {
          __typename: "FloatQuestion",
          slug: "question-7",
        },
      },
      {
        __typename: "QuestionEdge",
        node: {
          __typename: "MultipleChoiceQuestion",
          slug: "question-8",
        },
      },
      {
        __typename: "QuestionEdge",
        node: {
          __typename: "ChoiceQuestion",
          slug: "question-9",
        },
      },
      {
        __typename: "QuestionEdge",
        node: {
          __typename: "TableQuestion",
          slug: "question-10",
        },
      },
    ]);
  });
});
