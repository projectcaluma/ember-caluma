"use strict";

module.exports = {
  name: require("./package.json").name,

  options: {
    babel: {
      plugins: [
        require.resolve("ember-concurrency/async-arrow-task-transform"),
      ],
    },
  },
};
