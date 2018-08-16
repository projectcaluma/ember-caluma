const schema = `
type Form implements Node {
  id: ID!
  slug: String!
  name: String!
  description: String
  meta: String
}

type FormConnection {
  edges: [FormEdge]!
}

type FormEdge {
  node: Form
  cursor: String!
}

interface Node {
  id: ID!
}

input CreateFormInput {
  name: String!
  slug: String!
  description: String
  clientMutationId: String!
}

input UpdateFormInput {
  formId: ID!
  name: String
  description: String
  clientMutationId: String!
}

input DeleteFormInput {
  formId: ID!
  clientMutationId: String!
}

type CreateFormPayload {
  form: Form
  clientMutationId: String!
}

type UpdateFormPayload {
  form: Form
  clientMutationId: String!
}

type DeleteFormPayload {
  clientMutationId: String!
}

type Mutation {
  createForm(input: CreateFormInput!): CreateFormPayload
  updateForm(input: UpdateFormInput!): UpdateFormPayload
  deleteForm(input: DeleteFormInput!): DeleteFormPayload
}

type Query {
  node(id: ID!): Node
  allForms(before: String, after: String, first: Int, last: Int, id: ID, slug: String): FormConnection
}
`;

export default schema;
