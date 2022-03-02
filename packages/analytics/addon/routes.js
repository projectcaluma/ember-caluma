import buildRoutes from "ember-engines/routes";

export default buildRoutes(function () {
  this.route("reports", { path: "/" }, function () {
    this.route("edit", { path: "/:reportId" }, function () {
      this.route("preview");
      this.route("new");
    });
    this.route("new");
  });
});
