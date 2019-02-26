export default {
  __schema: {
    types: [
      {
        kind: "INTERFACE",
        name: "Node",
        possibleTypes: [
          {
            name: "Workflow"
          },
          {
            name: "Form"
          },
          {
            name: "Flow"
          },
          {
            name: "Case"
          },
          {
            name: "Document"
          },
          {
            name: "WorkItem"
          },
          {
            name: "Option"
          },
          {
            name: "TextQuestion"
          },
          {
            name: "ChoiceQuestion"
          },
          {
            name: "MultipleChoiceQuestion"
          },
          {
            name: "TextareaQuestion"
          },
          {
            name: "FloatQuestion"
          },
          {
            name: "IntegerQuestion"
          },
          {
            name: "TableQuestion"
          },
          {
            name: "StringAnswer"
          },
          {
            name: "ListAnswer"
          },
          {
            name: "IntegerAnswer"
          },
          {
            name: "FloatAnswer"
          },
          {
            name: "TableAnswer"
          },
          {
            name: "SimpleTask"
          },
          {
            name: "CompleteWorkflowFormTask"
          },
          {
            name: "CompleteTaskFormTask"
          }
        ]
      },
      {
        kind: "INTERFACE",
        name: "Task",
        possibleTypes: [
          {
            name: "SimpleTask"
          },
          {
            name: "CompleteWorkflowFormTask"
          },
          {
            name: "CompleteTaskFormTask"
          }
        ]
      },
      {
        kind: "INTERFACE",
        name: "Question",
        possibleTypes: [
          {
            name: "TextQuestion"
          },
          {
            name: "ChoiceQuestion"
          },
          {
            name: "MultipleChoiceQuestion"
          },
          {
            name: "TextareaQuestion"
          },
          {
            name: "FloatQuestion"
          },
          {
            name: "IntegerQuestion"
          },
          {
            name: "TableQuestion"
          }
        ]
      },
      {
        kind: "INTERFACE",
        name: "Answer",
        possibleTypes: [
          {
            name: "StringAnswer"
          },
          {
            name: "ListAnswer"
          },
          {
            name: "IntegerAnswer"
          },
          {
            name: "FloatAnswer"
          },
          {
            name: "TableAnswer"
          }
        ]
      }
    ]
  }
};
