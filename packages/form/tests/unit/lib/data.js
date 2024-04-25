import { v4 } from "uuid";

const id = (type, identifier = v4()) => btoa(`${type}:${identifier}`);

const form = {
  slug: "form",
  meta: {
    "is-top-form": true,
    level: 0,
  },
  questions: {
    edges: [
      {
        node: {
          slug: "question-1",
          label: "Question 1",
          isRequired: "true",
          isHidden: "false",
          textDefaultAnswer: {
            __typename: "StringAnswer",
            value: "test answer",
          },
          meta: {},
          __typename: "TextQuestion",
        },
      },
      {
        node: {
          slug: "question-2",
          label: "Question 2",
          isRequired: "'question-1'|answer == 'require-question-2'",
          isHidden: "!('question-1'|answer == 'show-question-2')",
          meta: {},
          __typename: "TextQuestion",
        },
      },
      {
        node: {
          slug: "question-3",
          label: "Question 3",
          isRequired: "false",
          isHidden:
            "!('question-1'|answer == 'show-question-3' || 'question-2'|answer == 'show-question-3')",
          meta: {},
          __typename: "TextQuestion",
        },
      },
      {
        node: {
          slug: "float",
          label: "Float question",
          isRequired: "false",
          isHidden: "'question-1'|answer == 'hide-float'",
          meta: {},
          __typename: "FloatQuestion",
        },
      },
      {
        node: {
          slug: "calculated",
          label: "Calculated question",
          isRequired: "false",
          isHidden: "false",
          calcExpression:
            "('test' in 'table'|answer|mapby('table-form-question')) ? 100 : 'float'|answer + 5 * 100",
          meta: {},
          __typename: "CalculatedFloatQuestion",
        },
      },
      {
        node: {
          slug: "table",
          label: "Table",
          isRequired: "false",
          isHidden: "false",
          tableDefaultAnswer: {
            value: [
              {
                answers: {
                  edges: [
                    {
                      node: {
                        question: {
                          slug: "table-form-question",
                        },
                        stringValue: "show-multiple-choice",
                        __typename: "StringAnswer",
                      },
                    },
                    {
                      node: {
                        question: {
                          slug: "table-form-question-2",
                        },
                        stringValue: "test",
                        __typename: "StringAnswer",
                      },
                    },
                  ],
                },
              },
            ],
          },
          meta: {},
          __typename: "TableQuestion",
        },
      },
      {
        node: {
          slug: "multiple-choice",
          label: "MultipleChoice",
          isRequired: "false",
          isHidden:
            "!('show-multiple-choice' in 'table'|answer|mapby('table-form-question'))",
          meta: {},
          __typename: "MultipleChoiceQuestion",
        },
      },
      {
        node: {
          slug: "json-dependency",
          label: "Test JSON dependency",
          isRequired: "false",
          isHidden:
            "!('[\"test1\",\"test2\"]' in 'table'|answer|mapby('table-form-question', 'table-form-question-2')|stringify)",
          meta: {},
          __typename: "TextQuestion",
        },
      },
    ],
  },
  __typename: "Form",
};

const answers = {
  edges: [
    {
      node: {
        id: id("StringAnswer"),
        question: {
          slug: "question-1",
        },
        stringValue: "test answer",
        __typename: "StringAnswer",
      },
    },
    {
      node: {
        id: id("StringAnswer"),
        question: {
          slug: "question-2",
        },
        stringValue: "test answer 2",
        __typename: "StringAnswer",
      },
    },
    {
      node: {
        id: id("FloatAnswer"),
        question: { slug: "float" },
        floatValue: 1.1,
        __typename: "FloatAnswer",
      },
    },
    {
      node: {
        id: id("TableAnswer"),
        question: {
          slug: "table",
        },
        tableValue: [
          {
            id: id("Document"),
            form: {
              slug: "table-form",
              meta: {
                "is-top-form": false,
                level: 1,
              },
              questions: {
                edges: [
                  {
                    node: {
                      slug: "table-form-question",
                      label: "Question",
                      isRequired: "true",
                      isHidden: "false",
                      meta: {},
                      __typename: "TextQuestion",
                    },
                  },
                  {
                    node: {
                      slug: "table-form-question-2",
                      label: "Question",
                      isRequired: "false",
                      isHidden: "false",
                      meta: {},
                      __typename: "TextQuestion",
                    },
                  },
                ],
              },
              __typename: "Form",
            },
            answers: {
              edges: [
                {
                  node: {
                    id: id("StringAnswer"),
                    question: {
                      slug: "table-form-question",
                    },
                    stringValue: "show-multiple-choice",
                    __typename: "StringAnswer",
                  },
                },
                {
                  node: {
                    id: id("StringAnswer"),
                    question: {
                      slug: "table-form-question-2",
                    },
                    stringValue: "test",
                    __typename: "StringAnswer",
                  },
                },
              ],
            },
            __typename: "Document",
          },
        ],
        __typename: "TableAnswer",
      },
    },
  ],
};

const workItem = {
  id: id("WorkItem"),
  case: {
    id: id("Case"),
    family: {
      id: id("Case"),
      document: {
        id: id("Document"),
        form: {
          slug: "main-case-form",
        },
      },
    },
  },
};

export default {
  id: id("Document"),
  answers,
  form,
  workItem,
  __typename: "Document",
};
