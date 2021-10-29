import buildRoutes from "ember-engines/routes";

export default buildRoutes(function () {
  this.route("distribution", { path: "/case/:case" }, function () {
    this.route("inquiry", { path: "/from/:from/to/:to" }, function () {});
  });
});
