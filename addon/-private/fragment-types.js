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
            name: "Document"
          },
          {
            name: "FormAnswer"
          },
          {
            name: "Case"
          },
          {
            name: "WorkItem"
          },
          {
            name: "Flow"
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
            name: "DateQuestion"
          },
          {
            name: "TableQuestion"
          },
          {
            name: "FormQuestion"
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
            name: "DateAnswer"
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
            name: "DateQuestion"
          },
          {
            name: "TableQuestion"
          },
          {
            name: "FormQuestion"
          }
        ]
      },
      {
        kind: "INTERFACE",
        name: "Answer",
        possibleTypes: [
          {
            name: "FormAnswer"
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
            name: "DateAnswer"
          },
          {
            name: "TableAnswer"
          }
        ]
      }
    ]
  }
};
