import buildRoutes from "ember-engines/routes";

export default buildRoutes(function() {
  this.route("new");
  this.route("edit", { path: "/:form_slug" }, function() {
    this.route("general", { path: "/" });
    this.route("question", { path: "/:question_slug" });
  });
});
