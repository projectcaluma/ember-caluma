import Route from "@ember/routing/route";
import { RouteQueryManager } from "ember-apollo-client";
import gql from "graphql-tag";

export default Route.extend(RouteQueryManager, {
  async model() {
    const documents = await this.apollo.query(
      {
        query: gql`
          query {
            allDocuments(form: "formular-1") {
              edges {
                node {
                  id
                }
              }
            }
          }
        `
      },
      "allDocuments.edges"
    );

    if (!documents.length) {
      return await this.apollo.mutate(
        {
          mutation: gql`
            mutation($input: SaveDocumentInput!) {
              saveDocument(input: $input) {
                document {
                  id
                }
              }
            }
          `,
          variables: {
            input: {
              form: "formular-1"
            }
          }
        },
        "saveDocument.document.id"
      );
    }

    return documents[0].node.id;
  }
});
