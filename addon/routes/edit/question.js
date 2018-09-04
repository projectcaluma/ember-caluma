import Route from "@ember/routing/route";

export default Route.extend({
  model: ({ question_slug }) => question_slug
});
