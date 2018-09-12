export default {
  __schema: {
    types: [
      {
        kind: "INTERFACE",
        name: "Node",
        possibleTypes: [
          {
            name: "Document"
          },
          {
            name: "Form"
          },
          {
            name: "Question"
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
          }
        ]
      }
    ]
  }
};
