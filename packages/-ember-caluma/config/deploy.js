"use strict";

module.exports = function () {
  const ENV = {
    build: {},
    git: {
      repo: "git@github.com:projectcaluma/ember-caluma.git",
      branch: "gh-pages",
      destDir: "ember-caluma",
    },
  };

  return ENV;
};
