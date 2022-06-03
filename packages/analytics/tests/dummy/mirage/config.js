import graphqlHandler from "@projectcaluma/ember-testing/mirage-graphql";

export default function () {
  this.post("/graphql/", graphqlHandler(this), 200);
}
