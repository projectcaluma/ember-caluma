import Route from "@ember/routing/route";

export default Route.extend({
  model({ sub_section }) {
    return {
      sub_section,
      section: this.modelFor("nested.section"),
      documentId: this.modelFor("nested")
    };
  }
});
