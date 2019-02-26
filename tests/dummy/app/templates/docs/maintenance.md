# Maintenance

The addon includes a mirage server for mocking Caluma's GraphQL API, which is generated from the GraphQL schema definition. If the upstream GraphQL schema changed you can update the addon by running

```bash
yarn update-schema
yarn fragment-types
```
