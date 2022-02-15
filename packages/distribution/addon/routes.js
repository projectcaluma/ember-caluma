import buildRoutes from "ember-engines/routes";

export default buildRoutes(function () {
  this.route("new");
  this.route("inquiry", { path: "/from/:from/to/:to" }, function () {
    this.route("detail", { path: "/:inquiry" }, function () {
      this.route("answer");
    });
  });
  this.route("notfound", { path: "/*path" });
});
