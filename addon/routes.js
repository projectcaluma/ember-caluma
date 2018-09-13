import buildRoutes from "ember-engines/routes";

export default buildRoutes(function() {
  this.route("new");
  this.route("edit", { path: "/:form_slug" }, function() {
    this.route("general", { path: "/" });
    this.route("questions", { path: "/questions" }, function() {
      this.route("edit", { path: "/:question_slug" });
      this.route("new", { path: "/new" });
    });
  });
});
