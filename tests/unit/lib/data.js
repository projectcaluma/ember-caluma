import { v4 } from "uuid";

const id = (type, identifier = v4()) => btoa(`${type}:${identifier}`);

const form = {
  slug: "form",
  questions: {
    edges: [
      {
        node: {
          slug: "question-1",
          label: "Question 1",
          isRequired: "false",
          isHidden: "false",
          textDefaultAnswer: {
            __typename: "StringAnswer",
            value: "test answer",
          },
          __typename: "TextQuestion",
        },
      },
      {
        node: {
          slug: "question-2",
          label: "Question 2",
          isRequired: "'question-1'|answer == 'require-question-2'",
          isHidden: "!('question-1'|answer == 'show-question-2')",
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
          __typename: "TextQuestion",
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
                  ],
                },
              },
            ],
          },
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
          __typename: "MultipleChoiceQuestion",
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
        id: id("TableAnswer"),
        question: {
          slug: "table",
        },
        tableValue: [
          {
            id: id("Document"),
            form: {
              slug: "table-form",
              questions: {
                edges: [
                  {
                    node: {
                      slug: "table-form-question",
                      label: "Question",
                      isRequired: "true",
                      isHidden: "false",
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

export default {
  id: id("Document"),
  answers,
  form,
  __typename: "Document",
};
