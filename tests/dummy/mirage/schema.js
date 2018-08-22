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

input SaveFormInput {
  slug: String!
  name: String
  description: String
  clientMutationId: String!
}

input DeleteFormInput {
  id: ID!
  clientMutationId: String!
}

type SaveFormPayload {
  form: Form
  clientMutationId: String!
}

type DeleteFormPayload {
  form: Form
  clientMutationId: String!
}

type Mutation {
  saveForm(input: SaveFormInput!): SaveFormPayload
  deleteForm(input: DeleteFormInput!): DeleteFormPayload
}

type Query {
  node(id: ID!): Node
  allForms(before: String, after: String, first: Int, last: Int, id: ID, slug: String): FormConnection
}
`;

export default schema;
