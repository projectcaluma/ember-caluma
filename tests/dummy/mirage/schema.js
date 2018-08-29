const schema = `
type Form implements Node {
  id: ID!
  slug: String!
  name: String!
  description: String
  isArchived: Boolean
  meta: String
  questions: QuestionConnection
}

type Question implements Node {
  id: ID!
  slug: String!
  label: String!
  type: String!
  meta: String
  forms: FormConnection
}

type FormConnection {
  edges: [FormEdge]!
}

type QuestionConnection {
  edges: [QuestionEdge]!
}

type FormEdge {
  node: Form
  cursor: String!
}

type QuestionEdge {
  node: Question
  cursor: String!
}

interface Node {
  id: ID!
}

input SaveFormInput {
  slug: String!
  name: String
  description: String
  clientMutationId: String!
}

type SaveFormPayload {
  form: Form
  clientMutationId: String!
}

input SaveQuestionInput {
  slug: String!
  label: String
  type: String
  clientMutationId: String!
}

type SaveQuestionPayload {
  question: Question
  clientMutationId: String!
}

input ArchiveFormInput {
  id: ID!
  clientMutationId: String!
}

input ReorderFormQuestionsInput {
  formId: ID!
  questionIds: [ID]!
  clientMutationId: String!
}

type ArchiveFormPayload {
  form: Form
  clientMutationId: String!
}

type ReorderFormQuestionsPayload {
  form: Form
  questions: QuestionConnection
  clientMutationId: String!
}

type Mutation {
  saveForm(input: SaveFormInput!): SaveFormPayload
  saveQuestion(input: SaveQuestionInput!): SaveQuestionPayload
  archiveForm(input: ArchiveFormInput!): ArchiveFormPayload
  reorderFormQuestions(input: ReorderFormQuestionsInput!): ReorderFormQuestionsPayload
}

type Query {
  node(id: ID!): Node
  allForms(isArchived: Boolean): FormConnection
}
`;

export default schema;
