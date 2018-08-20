import buildRoutes from "ember-engines/routes";

export default buildRoutes(function() {
  this.route("edit", { path: "/:slug" }, function() {
    this.route("general", { path: "/" });
  });
});
