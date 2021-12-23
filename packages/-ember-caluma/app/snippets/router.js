Router.map(function () {
  // ...

  this.mount("@projectcaluma/ember-form-builder", {
    as: "form-builder",
    path: "/form-builder",
  });
});
