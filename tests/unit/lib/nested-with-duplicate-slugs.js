export default {
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
            id: "RG9jdW1lbnQ6MjI5NTY3ZDAtMTkyYy00YzVkLWEzNjYtZThmZjQ3MDkzMGFh",
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
            id: "RG9jdW1lbnQ6ZjliYWMxNDItOWUzMC00OTg3LWIzZDAtOWFjOTRmMzk1ODU1",
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
