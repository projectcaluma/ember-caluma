export default {
  __schema: {
    types: [
      {
        kind: "INTERFACE",
        name: "Node",
        possibleTypes: [
          {
            name: "Workflow",
          },
          {
            name: "Form",
          },
          {
            name: "Document",
          },
          {
            name: "Case",
          },
          {
            name: "WorkItem",
          },
          {
            name: "Flow",
          },
          {
            name: "DynamicOption",
          },
          {
            name: "StaticQuestion",
          },
          {
            name: "Option",
          },
          {
            name: "TextQuestion",
          },
          {
            name: "StringAnswer",
          },
          {
            name: "ChoiceQuestion",
          },
          {
            name: "MultipleChoiceQuestion",
          },
          {
            name: "ListAnswer",
          },
          {
            name: "DynamicChoiceQuestion",
          },
          {
            name: "DynamicMultipleChoiceQuestion",
          },
          {
            name: "TextareaQuestion",
          },
          {
            name: "FloatQuestion",
          },
          {
            name: "FloatAnswer",
          },
          {
            name: "IntegerQuestion",
          },
          {
            name: "IntegerAnswer",
          },
          {
            name: "DateQuestion",
          },
          {
            name: "DateAnswer",
          },
          {
            name: "TableQuestion",
          },
          {
            name: "TableAnswer",
          },
          {
            name: "FormQuestion",
          },
          {
            name: "FileQuestion",
          },
          {
            name: "FileAnswer",
          },
          {
            name: "File",
          },
          {
            name: "SimpleTask",
          },
          {
            name: "CompleteWorkflowFormTask",
          },
          {
            name: "CompleteTaskFormTask",
          },
        ],
      },
      {
        kind: "INTERFACE",
        name: "Task",
        possibleTypes: [
          {
            name: "SimpleTask",
          },
          {
            name: "CompleteWorkflowFormTask",
          },
          {
            name: "CompleteTaskFormTask",
          },
        ],
      },
      {
        kind: "INTERFACE",
        name: "Question",
        possibleTypes: [
          {
            name: "StaticQuestion",
          },
          {
            name: "TextQuestion",
          },
          {
            name: "ChoiceQuestion",
          },
          {
            name: "MultipleChoiceQuestion",
          },
          {
            name: "DynamicChoiceQuestion",
          },
          {
            name: "DynamicMultipleChoiceQuestion",
          },
          {
            name: "TextareaQuestion",
          },
          {
            name: "FloatQuestion",
          },
          {
            name: "IntegerQuestion",
          },
          {
            name: "DateQuestion",
          },
          {
            name: "TableQuestion",
          },
          {
            name: "FormQuestion",
          },
          {
            name: "FileQuestion",
          },
        ],
      },
      {
        kind: "INTERFACE",
        name: "Answer",
        possibleTypes: [
          {
            name: "StringAnswer",
          },
          {
            name: "ListAnswer",
          },
          {
            name: "FloatAnswer",
          },
          {
            name: "IntegerAnswer",
          },
          {
            name: "DateAnswer",
          },
          {
            name: "TableAnswer",
          },
          {
            name: "FileAnswer",
          },
        ],
      },
    ],
  },
};
