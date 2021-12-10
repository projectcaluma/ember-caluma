import buildRoutes from "ember-engines/routes";

export default buildRoutes(function () {
  this.route("distribution", { path: "/case/:case" }, function () {
    this.route("new");
    this.route("inquiry", { path: "/from/:from/to/:to" }, function () {
      this.route("detail", { path: "/detail/:inquiry" }, function () {
        this.route("answer");
      });
    });
  });
});
