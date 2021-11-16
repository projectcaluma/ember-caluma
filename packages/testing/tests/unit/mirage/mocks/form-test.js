import { setupMirage } from "ember-cli-mirage/test-support";
import { setupTest } from "ember-qunit";
import { gql } from "graphql-tag";
import { module, test } from "qunit";

module("Unit | Mirage GraphQL Mock | form", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.form = this.server.create("form", {
      name: "Test Form",
      slug: "test-form",
    });

    this.apollo = this.owner.lookup("service:apollo");
  });

  test("can filter archived forms", async function (assert) {
    assert.expect(1);

    this.form = this.server.create("form", {
      slug: "archived-form",
      isArchived: true,
    });
    this.form.update({
      questions: [
        this.server.create("question", { slug: "question-1", type: "TEXT" }),
        this.server.create("question", { slug: "question-2", type: "TEXT" }),
        this.server.create("question", { slug: "question-3", type: "TEXT" }),
      ],
    });

    const res = await this.apollo.query({
      query: gql`
        query {
          allForms(isArchived: true) {
            edges {
              node {
                slug
              }
            }
          }
        }
      `,
    });

    assert.deepEqual(res.allForms.edges, [
      {
        __typename: "FormEdge",
        node: {
          __typename: "Form",
          slug: "archived-form",
        },
      },
    ]);
  });

  test("can reorder questions", async function (assert) {
    assert.expect(1);

    this.form.update({
      questions: [
        this.server.create("question", { slug: "question-1", type: "TEXT" }),
        this.server.create("question", { slug: "question-2", type: "TEXT" }),
        this.server.create("question", { slug: "question-3", type: "TEXT" }),
      ],
    });

    const res = await this.apollo.mutate({
      mutation: gql`
        mutation ReorderFormQuestions($input: ReorderFormQuestionsInput!) {
          reorderFormQuestions(input: $input) {
            form {
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
      `,
      variables: {
        input: {
          form: "test-form",
          questions: ["question-2", "question-3", "question-1"],
        },
      },
    });

    assert.deepEqual(res.reorderFormQuestions.form.questions.edges, [
      {
        __typename: "QuestionEdge",
        node: {
          slug: "question-2",
          __typename: "TextQuestion",
        },
      },
      {
        __typename: "QuestionEdge",
        node: {
          slug: "question-3",
          __typename: "TextQuestion",
        },
      },
      {
        __typename: "QuestionEdge",
        node: {
          slug: "question-1",
          __typename: "TextQuestion",
        },
      },
    ]);
  });

  test("can add question", async function (assert) {
    assert.expect(1);

    this.server.create("question", { slug: "test-question", type: "TEXT" });

    const res = await this.apollo.mutate({
      mutation: gql`
        mutation AddFormQuestion($input: AddFormQuestionInput!) {
          addFormQuestion(input: $input) {
            form {
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
      `,
      variables: {
        input: {
          form: "test-form",
          question: "test-question",
        },
      },
    });

    assert.deepEqual(res.addFormQuestion.form.questions.edges, [
      {
        __typename: "QuestionEdge",
        node: {
          slug: "test-question",
          __typename: "TextQuestion",
        },
      },
    ]);
  });

  test("can remove question", async function (assert) {
    assert.expect(1);

    this.form.update({
      questions: [
        this.server.create("question", { slug: "question-1", type: "TEXT" }),
        this.server.create("question", { slug: "question-2", type: "TEXT" }),
      ],
    });

    const res = await this.apollo.mutate({
      mutation: gql`
        mutation RemoveFormQuestion($input: RemoveFormQuestionInput!) {
          removeFormQuestion(input: $input) {
            form {
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
      `,
      variables: {
        input: {
          form: "test-form",
          question: "question-1",
        },
      },
    });

    assert.deepEqual(res.removeFormQuestion.form.questions.edges, [
      {
        __typename: "QuestionEdge",
        node: {
          slug: "question-2",
          __typename: "TextQuestion",
        },
      },
    ]);
  });
});
