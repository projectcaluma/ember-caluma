import { setupMirage } from "ember-cli-mirage/test-support";
import { setupTest } from "ember-qunit";
import { gql } from "graphql-tag";
import { assert, module, test } from "qunit";

module("Unit | Mirage GraphQL Filter | answer", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const { id: formId } = this.server.create("form", { slug: "test-form" });
    const { id: documentId } = this.server.create("document", {
      formId,
    });

    this.question = this.server.create("question", {
      type: "TEXT",
      formIds: [formId],
    });
    this.otherQuestion = this.server.create("question", {
      type: "TEXT",
      formIds: [formId],
    });

    this.answer = this.server.create("answer", {
      questionId: this.question.id,
      documentId,
    });
    this.otherAnswer = this.server.create("answer", {
      questionId: this.otherQuestion.id,
      documentId,
    });

    this.apollo = this.owner.lookup("service:apollo");
    this.query = gql`
      query documents($question: ID!, $invert: Boolean!) {
        allDocuments {
          edges {
            node {
              id
              answers(filter: [{ question: $question, invert: $invert }]) {
                edges {
                  node {
                    id
                    question {
                      slug
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
  });

  test("can filter based on question", async function () {
    const res = await this.apollo.query({
      query: this.query,
      variables: {
        question: this.question.slug,
        invert: false,
      },
    });

    assert.deepEqual(
      res.allDocuments.edges[0].node.answers.edges.map(({ node }) => node),
      [
        {
          __typename: "StringAnswer",
          id: window.btoa(`StringAnswer:${this.answer.id}`),
          question: {
            __typename: "TextQuestion",
            slug: this.question.slug,
          },
        },
      ]
    );
  });

  test("can inverse filter based on question", async function () {
    const res = await this.apollo.query({
      query: this.query,
      variables: {
        question: this.question.slug,
        invert: true,
      },
    });

    assert.deepEqual(
      res.allDocuments.edges[0].node.answers.edges.map(({ node }) => node),
      [
        {
          __typename: "StringAnswer",
          id: window.btoa(`StringAnswer:${this.otherAnswer.id}`),
          question: {
            __typename: "TextQuestion",
            slug: this.otherQuestion.slug,
          },
        },
      ]
    );
  });
});
