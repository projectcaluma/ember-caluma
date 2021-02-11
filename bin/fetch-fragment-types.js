"use strict";

const fs = require("fs");

// eslint-disable-next-line node/no-unpublished-require
const fetch = require("node-fetch");

fetch("http://localhost:8000/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    variables: {},
    operationName: "",
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
    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = result.data.__schema.types.filter(
      (type) => type.possibleTypes !== null
    );
    result.data.__schema.types = filteredData;
    fs.writeFile(
      "addon/-private/fragment-types.js",
      `export default ${JSON.stringify(result.data, null, 2)}`,
      (err) => {
        if (err) throw err;
        // eslint-disable-next-line no-console
        console.log("The file has been saved!");
      }
    );
  });
