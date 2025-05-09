"use strict";

module.exports = {
  plugins: ["prettier-plugin-ember-template-tag"],
  overrides: [
    {
      files: "*.{js,gjs,ts,gts,mjs,mts,cjs,cts}",
      options: {
        singleQuote: false,
      },
    },
    {
      files: "*.{gjs,gts}",
      options: {
        singleQuote: false,
        templateSingleQuote: false,
      },
    },
  ],
};
