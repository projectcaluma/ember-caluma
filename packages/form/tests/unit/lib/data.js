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
          __typename: "TextareaQuestion",
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
          multipleChoiceOptions: {
            edges: [
              { node: { label: "Option A", slug: "checkbox-a" } },
              { node: { label: "Option B", slug: "checkbox-b" } },
              { node: { label: "Option C", slug: "checkbox-c" } },
              { node: { label: "Option D", slug: "checkbox-d" } },
            ],
          },
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
      {
        node: {
          slug: "choice",
          label: "Choice",
          isRequired: "false",
          isHidden: "false",
          meta: {},
          choiceOptions: {
            edges: [
              { node: { label: "Option A", slug: "radio-a" } },
              { node: { label: "Option B", slug: "radio-b" } },
              { node: { label: "Option C", slug: "radio-c" } },
              { node: { label: "Option D", slug: "radio-d" } },
            ],
          },
          __typename: "ChoiceQuestion",
        },
      },
    ],
  },
  __typename: "Form",
};

const _case = {
  id: id("Case"),
  workflow: {
    id: id("Workflow", "child-case-workflow"),
    slug: "child-case-workflow",
  },
  document: {
    id: id("Document"),
    form: {
      id: id("Form", "child-case-form"),
      slug: "child-case-form",
    },
  },
  family: {
    id: id("Case"),
    workflow: {
      id: id("Workflow", "root-case-workflow"),
      slug: "root-case-workflow",
    },
    document: {
      id: id("Document"),
      form: {
        id: id("Form", "root-case-form"),
        slug: "root-case-form",
      },
    },
  },
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
        __typename: "TextareaAnswer",
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

const historicalAnswers = {
  edges: [
    {
      node: {
        id: id("HistoricalStringAnswer"),
        question: {
          slug: "question-1",
        },
        stringValue: "test answer",
        historyDate: "2024-01-01T00:00:00Z",
        historyType: "=",
        historyUserId: id("User"),
        __typename: "HistoricalStringAnswer",
      },
    },
    {
      node: {
        id: id("HistoricalStringAnswer"),
        question: {
          slug: "question-2",
        },
        stringValue: "test answer 2",
        historyDate: "2024-01-01T00:00:00Z",
        historyType: "=",
        historyUserId: id("User"),
        __typename: "HistoricalStringAnswer",
      },
    },
    {
      node: {
        id: id("HistoricalIntegerAnswer"),
        question: { slug: "integer" },
        floatValue: 1,
        historyDate: "2024-01-01T00:00:00Z",
        historyType: "=",
        historyUserId: id("User"),
        __typename: "HistoricalIntegerAnswer",
      },
    },
    {
      node: {
        id: id("HistoricalFloatAnswer"),
        question: { slug: "float" },
        floatValue: 1.1,
        historyDate: "2024-01-01T00:00:00Z",
        historyType: "=",
        historyUserId: id("User"),
        __typename: "HistoricalFloatAnswer",
      },
    },
    {
      node: {
        id: id("HistoricalTableAnswer"),
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
                    id: id("HistoricalStringAnswer"),
                    question: {
                      slug: "table-form-question",
                    },
                    stringValue: "show-multiple-choice",
                    __typename: "HistoricalStringAnswer",
                    historyDate: "2024-01-01T00:00:00Z",
                    historyType: "=",
                    historyUserId: id("User"),
                  },
                },
                {
                  node: {
                    id: id("HistoricalStringAnswer"),
                    question: {
                      slug: "table-form-question-2",
                    },
                    stringValue: "test",
                    __typename: "HistoricalStringAnswer",
                    historyDate: "2024-01-01T00:00:00Z",
                    historyType: "=",
                    historyUserId: id("User"),
                  },
                },
              ],
            },
            __typename: "HistoricalDocument",
          },
          {
            id: id("HistoricalDocument"),
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
                    id: id("HistoricalStringAnswer"),
                    question: {
                      slug: "table-form-question",
                    },
                    stringValue: "show-multiple-choice2",
                    historyDate: "2024-01-01T00:00:00Z",
                    historyType: "=",
                    historyUserId: id("User"),
                    __typename: "HistoricalStringAnswer",
                  },
                },
                {
                  node: {
                    id: id("HistoricalStringAnswer"),
                    question: {
                      slug: "table-form-question-2",
                    },
                    stringValue: "",
                    historyDate: "2024-01-01T00:00:00Z",
                    historyType: "=",
                    historyUserId: id("User"),
                    __typename: "HistoricalStringAnswer",
                  },
                },
              ],
            },
            __typename: "HistoricalDocument",
          },
        ],
        __typename: "HistoricalTableAnswer",
      },
    },
    {
      node: {
        id: id("HistoricalCalculatedFloatAnswer"),
        question: { slug: "calculated" },
        floatValue: 501.1,
        historyDate: "2024-01-01T00:00:00Z",
        historyType: "=",
        historyUserId: id("User"),
        __typename: "HistoricalCalculatedFloatAnswer",
      },
    },
    {
      node: {
        id: id("HistoricalMultipleChoiceAnswer"),
        question: { slug: "multiple-choice" },
        multipleChoiceValue: ["checkbox-a", "checkbox-c"],
        historyDate: "2024-01-01T00:00:00Z",
        historyType: "=",
        historyUserId: id("User"),
        __typename: "HistoricalMultipleChoiceAnswer",
      },
    },
    {
      node: {
        id: id("HistoricalChoiceAnswer"),
        question: { slug: "choice" },
        choiceValue: "radio-a",
        historyDate: "2024-01-01T00:00:00Z",
        historyType: "=",
        historyUserId: id("User"),
        __typename: "HistoricalChoiceAnswer",
      },
    },
  ],
};

const workItem = {
  id: id("WorkItem"),
  case: _case,
};

export const rawDocumentWithCase = {
  id: id("Document"),
  answers,
  form,
  case: _case,
  __typename: "Document",
};

export const rawHistoricalDocumentWithCase = {
  id: id("Document"),
  answers: historicalAnswers,
  historicalAnswers,
  form,
  case: _case,
  __typename: "Document",
};

export const rawDocumentWithWorkItem = {
  id: id("Document"),
  answers,
  form,
  workItem,
  __typename: "Document",
};

export const rawUnlinkedDocument = {
  id: id("Document"),
  answers,
  form,
  __typename: "Document",
};
