"use strict";

const fs = require("fs");

// eslint-disable-next-line node/no-unpublished-require
const fetch = require("node-fetch");

fetch("http://localhost:8000/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    variables: {},
    query: `
      {
        __schema {
          types {
            kind
            name
            possibleTypes {
              name
            }
          }
        }
      }
    `,
  }),
})
  .then((result) => result.json())
  .then((result) => {
    const possibleTypes = {};

    result.data.__schema.types.forEach((supertype) => {
      if (supertype.possibleTypes) {
        possibleTypes[supertype.name] = supertype.possibleTypes.map(
          (subtype) => subtype.name
        );
      }
    });

    fs.writeFile(
      "addon/-private/possible-types.js",
      `export default ${JSON.stringify(possibleTypes)}`,
      (err) => {
        if (err) {
          console.error("Error writing possible-types.js", err);
        } else {
          // eslint-disable-next-line no-console
          console.log("Fragment types successfully extracted!");
        }
      }
    );
  });
