import { module, test, skip } from "qunit";
import { setupTest } from "ember-qunit";
import Document from "ember-caluma/lib/document";
import { settled } from "@ember/test-helpers";

module("Unit | Library | document", function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(async function() {
    this.set("setFieldValue", async (slug, value) => {
      this.document.fields
        .find(field => field.question.slug === slug)
        .set("answer.value", value);
      await settled();
    });
    this.set("getDocumentHiddenState", () =>
      this.document.fields.map(field => [
        field.question.slug,
        field.question.hidden
      ])
    );

    const raw = {
      id: 1,
      answers: {
        edges: []
      },
      form: {
        questions: {
          edges: [
            {
              node: {
                slug: "question-1",
                label: "Question 1",
                isRequired: "false",
                isHidden: "false",
                __typename: "TextQuestion"
              }
            },
            {
              node: {
                slug: "question-2",
                label: "Question 2",
                isRequired: "false",
                isHidden: "'question-1'|answer == 'magic'",
                __typename: "TextQuestion"
              }
            },
            {
              node: {
                slug: "question-3",
                label: "Question 3",
                isRequired: "false",
                isHidden: "'question-2'|answer == 'Harry Potter'",
                __typename: "TextQuestion"
              }
            }
          ]
        }
      }
    };

    const nestedRaw = {
      id: "RG9jdW1lbnQ6Mzc1NmQ1MTUtMjdkMC00NGE3LTlkNzUtYjczYjE2MzE5OWMy",
      form: {
        slug: "main",
        questions: {
          edges: [
            {
              node: {
                slug: "a",
                label: "a",
                isRequired: "false",
                isHidden: "false",
                meta: {},
                __typename: "FormQuestion"
              },
              __typename: "QuestionEdge"
            },
            {
              node: {
                slug: "b",
                label: "b",
                isRequired: "false",
                isHidden: "false",
                meta: {},
                __typename: "FormQuestion"
              },
              __typename: "QuestionEdge"
            }
          ],
          __typename: "QuestionConnection"
        },
        __typename: "Form"
      },
      __typename: "Document",
      answers: {
        edges: [
          {
            node: {
              id:
                "Rm9ybUFuc3dlcjozMzc0OWY0MC05YzZiLTQ5ZDItYTIxYi0zMDhlY2NjZWI3MWY=",
              question: { slug: "a", __typename: "FormQuestion" },
              formValue: {
                id:
                  "RG9jdW1lbnQ6MjI5NTY3ZDAtMTkyYy00YzVkLWEzNjYtZThmZjQ3MDkzMGFh",
                form: {
                  slug: "a",
                  questions: {
                    edges: [
                      {
                        node: {
                          slug: "a-a",
                          label: "a-a",
                          isRequired: "false",
                          isHidden: "false",
                          meta: {},
                          __typename: "FormQuestion"
                        },
                        __typename: "QuestionEdge"
                      },
                      {
                        node: {
                          slug: "a-b",
                          label: "a-b",
                          isRequired: "false",
                          isHidden: "false",
                          meta: {},
                          __typename: "FormQuestion"
                        },
                        __typename: "QuestionEdge"
                      }
                    ],
                    __typename: "QuestionConnection"
                  },
                  __typename: "Form"
                },
                __typename: "Document",
                answers: {
                  edges: [
                    {
                      node: {
                        id:
                          "Rm9ybUFuc3dlcjo4MWMzN2UyNS1mNWFiLTRiNzctYTExMi04MThkZTM0NzMwNTg=",
                        question: {
                          slug: "a-a",
                          __typename: "FormQuestion"
                        },
                        formValue: {
                          id:
                            "RG9jdW1lbnQ6N2UzZGVlMjYtZmExYS00YTNkLWE3MGItNWU1MTM5ZDRiNDQw",
                          answers: {
                            edges: [],
                            __typename: "AnswerConnection"
                          },
                          form: {
                            slug: "a-a",
                            questions: {
                              edges: [
                                {
                                  node: {
                                    slug: "a-a-1",
                                    label: "a-a-1",
                                    isRequired: "false",
                                    isHidden: "false",
                                    meta: {},
                                    textMaxLength: null,
                                    __typename: "TextQuestion"
                                  },
                                  __typename: "QuestionEdge"
                                }
                              ],
                              __typename: "QuestionConnection"
                            },
                            __typename: "Form"
                          },
                          __typename: "Document"
                        },
                        __typename: "FormAnswer"
                      },
                      __typename: "AnswerEdge"
                    },
                    {
                      node: {
                        id:
                          "Rm9ybUFuc3dlcjo5NTlhNzJkMS1mYzRiLTQzZWMtOGExYy05NmI0MTQ1OGI5MmE=",
                        question: {
                          slug: "a-b",
                          __typename: "FormQuestion"
                        },
                        formValue: {
                          id:
                            "RG9jdW1lbnQ6YjY3N2E1N2EtMDQwMS00ZDk4LTliMmItNGQxZTZhNmIzNWIw",
                          answers: {
                            edges: [],
                            __typename: "AnswerConnection"
                          },
                          form: {
                            slug: "a-b",
                            questions: {
                              edges: [
                                {
                                  node: {
                                    slug: "a-b-1",
                                    label: "a-b-1",
                                    isRequired: "false",
                                    isHidden: "false",
                                    meta: {},
                                    textMaxLength: null,
                                    __typename: "TextQuestion"
                                  },
                                  __typename: "QuestionEdge"
                                }
                              ],
                              __typename: "QuestionConnection"
                            },
                            __typename: "Form"
                          },
                          __typename: "Document"
                        },
                        __typename: "FormAnswer"
                      },
                      __typename: "AnswerEdge"
                    }
                  ],
                  __typename: "AnswerConnection"
                }
              },
              __typename: "FormAnswer"
            },
            __typename: "AnswerEdge"
          },
          {
            node: {
              id:
                "Rm9ybUFuc3dlcjo3YWU2NDNmNy0wNjQwLTRmYjAtODNlOS01MTA4ZDc4ZjkyNzI=",
              question: { slug: "b", __typename: "FormQuestion" },
              formValue: {
                id:
                  "RG9jdW1lbnQ6ZjliYWMxNDItOWUzMC00OTg3LWIzZDAtOWFjOTRmMzk1ODU1",
                form: {
                  slug: "b",
                  questions: {
                    edges: [
                      {
                        node: {
                          slug: "b-a",
                          label: "b-a",
                          isRequired: "false",
                          isHidden: "false",
                          meta: {},
                          __typename: "FormQuestion"
                        },
                        __typename: "QuestionEdge"
                      }
                    ],
                    __typename: "QuestionConnection"
                  },
                  __typename: "Form"
                },
                __typename: "Document",
                answers: {
                  edges: [
                    {
                      node: {
                        id:
                          "Rm9ybUFuc3dlcjoyYTRiN2JmYS04OTgyLTQ1NTQtYjg1Mi0xMTZhMzlhOTI5ODA=",
                        question: {
                          slug: "b-a",
                          __typename: "FormQuestion"
                        },
                        formValue: {
                          id:
                            "RG9jdW1lbnQ6NzVlZWY4ODUtMWI1Mi00NDBlLWJiZDQtZTc1OTNiM2E3OGE5",
                          answers: {
                            edges: [
                              {
                                node: {
                                  id:
                                    "U3RyaW5nQW5zd2VyOjRlYjE4ZDc3LTkwNDEtNGU3Yy1iNzJjLWU4NzMyMzk1MjkwMA==",
                                  question: {
                                    slug: "b-a-1",
                                    __typename: "TextQuestion"
                                  },
                                  stringValue: "foobar",
                                  __typename: "StringAnswer"
                                },
                                __typename: "AnswerEdge"
                              }
                            ],
                            __typename: "AnswerConnection"
                          },
                          form: {
                            slug: "b-a",
                            questions: {
                              edges: [
                                {
                                  node: {
                                    slug: "b-a-1",
                                    label: "b-a-1",
                                    isRequired: "false",
                                    isHidden: "false",
                                    meta: {},
                                    textMaxLength: null,
                                    __typename: "TextQuestion"
                                  },
                                  __typename: "QuestionEdge"
                                }
                              ],
                              __typename: "QuestionConnection"
                            },
                            __typename: "Form"
                          },
                          __typename: "Document"
                        },
                        __typename: "FormAnswer"
                      },
                      __typename: "AnswerEdge"
                    }
                  ],
                  __typename: "AnswerConnection"
                }
              },
              __typename: "FormAnswer"
            },
            __typename: "AnswerEdge"
          }
        ],
        __typename: "AnswerConnection"
      }
    };

    this.set("document", Document.create(this.owner.ownerInjection(), { raw }));
    this.set(
      "nestedDocument",
      Document.create(this.owner.ownerInjection(), { raw: nestedRaw })
    );
    await settled();
  });
  hooks.afterEach(async function() {
    await this.setFieldValue("question-1", null);
    await this.setFieldValue("question-2", null);
  });

  test("it initializes isHidden correctly", async function(assert) {
    assert.expect(1);
    assert.deepEqual(this.getDocumentHiddenState(), [
      ["question-1", false],
      ["question-2", true],
      ["question-3", true]
    ]);
  });

  test("it recomputes isHidden on value change of dependency", async function(assert) {
    assert.expect(1);
    await this.setFieldValue("question-1", "foo");
    await this.setFieldValue("question-2", "Harry Potter");
    assert.deepEqual(this.getDocumentHiddenState(), [
      ["question-1", false],
      ["question-2", false],
      ["question-3", true]
    ]);
  });

  test("it recomputes isHidden on isHidden change of dependency", async function(assert) {
    assert.expect(3);
    await this.setFieldValue("question-1", "foo");
    await this.setFieldValue("question-2", "bar");
    assert.deepEqual(this.getDocumentHiddenState(), [
      ["question-1", false],
      ["question-2", false],
      ["question-3", false]
    ]);
    await this.setFieldValue("question-1", "magic");
    assert.deepEqual(this.getDocumentHiddenState(), [
      ["question-1", false],
      ["question-2", true],
      ["question-3", true]
    ]);
    await this.setFieldValue("question-1", "foo");
    assert.deepEqual(this.getDocumentHiddenState(), [
      ["question-1", false],
      ["question-2", false],
      ["question-3", false]
    ]);
  });

  skip("finds answers in nested documents", async function(assert) {
    // get random leaf document
    const grandChildDoc = this.nestedDocument.childDocuments[0]
      .childDocuments[1];
    assert.deepEqual(grandChildDoc.findAnswer("b-a-1"), "foobar");
  });
});
