import { Response } from "miragejs";

import graphqlHandler from "@projectcaluma/ember-testing/mirage-graphql";

export default function () {
  this.post("/graphql/", graphqlHandler(this), 200);

  this.put("/minio/upload/:filename", (scheme, request) => {
    if (request.params.filename.startsWith("fail")) {
      return new Response(500);
    }
    return new Response(200);
  });
}
