import Route from "@ember/routing/route";

export default Route.extend({
  model({ section }) {
    return section;
  }
});
