import buildRoutes from "ember-engines/routes";

export default buildRoutes(function() {
  this.route("new");
  this.route("edit", { path: "/:slug" }, function() {
    this.route("general", { path: "/" });
  });
});
