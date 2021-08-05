# Testing

Per default, `ember-caluma` exposes models and factories for
`ember-cli-mirage` (if it is installed) into the host app. To use those
factories you need to install mirage and faker.

```bash
$ ember install ember-cli-mirage
$ yarn add -D faker ember-auto-import
```

Now you should be able to use the graphql endpoint in your test setup. To do
so add the following lines to your `mirage/config.js`:

```js
// mirage/config.js

import graphqlHandler from "@projectcaluma/ember-testing/mirage-graphql";

export default function () {
  // ...

  this.post("/graphql", graphqlHandler(this), 200);
}
```

You can also generate all of the models `ember-caluma` provides in your test setup:

```js
// available models are: answer, case, document, file, form, option, question,
// task and work-item

server.create("form");
server.createList("question", 10);
```

If you don't want to use the mirage setup for caluma in your host app you can
simply disable it in the options:

```js
// ember-cli-build.js

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // ..
    "ember-caluma": {
      includeMirageConfig: false,
    },
  });

  // ..
};
```
