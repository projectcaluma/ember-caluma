const schema = `
type Form implements Node {
  id: ID!
  slug: String!
  name: String!
  description: String
  meta: String
}

type FormConnection {
  # pageInfo: PageInfo!
  edges: [FormEdge]!
}

type FormEdge {
  node: Form
  cursor: String!
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  node(id: ID!): Node
  allForms(before: String, after: String, first: Int, last: Int, id: ID, slug: String): FormConnection
}
`;

export default schema;
