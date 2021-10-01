# Migration to v7

`ember-caluma` v7 upgrades `ember-apollo-client` to v3 which updated the
apollo client to v3. This results in some indirect breaking changes.

## GraphQL file extension

`ember-caluma` now imports all graphql files with their `.graphql` extension
since this is the new default. Whenever the consuming app imports any other
graphql files (which is very realistic) the imports need to have `.graphql`
as file extension:

```diff
- import someQuery from "yourapp/gql/queries/some-query";
+ import someQuery from "yourapp/gql/queries/some-query.graphql";
```

Also, make sure the `keepGraphqlFileExtension` is not overriding the default:

```js
// ember-cli-build.js

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    emberApolloClient: {
      // remove this if present
      keepGraphqlFileExtension: false,
    },
  });

  return app.toTree();
};
```

## Apollo Client

Apollo client v3 introduces numerous breaking changes, most of them are
changed imports. Please refer to [their migration guide](https://www.apollographql.com/docs/react/migrating/apollo-client-3-migration/)
for more details.
