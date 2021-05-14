# Queries

`ember-caluma` provides a way to fetch certain models via a practical API.
Currently, only fetching for `WorkItems` is supported - however, this will be
extended in time.

## Usage

To initialize such a query, simply inject it with the `calumaQuery` decorator:

```js
import Controller from "@ember/controller";
import calumaQuery from "ember-caluma/caluma-query";
import { allWorkItems } from "ember-caluma/caluma-query/queries";

export default class extends Controller {
  @calumaQuery({ query: allWorkItems, options: { pageSize: 10 } })
  workItemsQuery;

  setup() {
    this.workItemsQuery.fetch({
      filter: this.filter,
      order: this.order,
      queryOptions: this.queryOptions,
    });
  }

  @action
  loadMore() {
    this.workItemsQuery.fetchMore();
  }
}
```

The decorator expects two parameters:

- `query` The query to be used (see [queries](#queries))
- `options` (optional) The options to initialize the query (see
  [options](#options)). This can also be a `String` which will then be
  interpreted as a key of a property containing the options object.

The decorator will then initialize a query object that exposes the following
public methods:

- `fetch` To initially fetch the first page of the query. This will reset all existing items in the query. `fetch` takes the following optional arguments:

| Name           | Type              | Description                                                  |
| -------------- | ----------------- | ------------------------------------------------------------ |
| `filter`       | `String \| Object` | According to the `gql` filter type defined in the query you're using. |
| `order`        | `String \| Object` | According to the `gql` order type defined in the query you're using. |
| `queryOptions` | `Object`          | Pass options to `apollo.query`. For more information on what options exist, [see here](https://www.apollographql.com/docs/react/api/core/ApolloClient/#ApolloClient.query). |

- `fetchMore` This will load the next page of your data.

- Also, it exposes some helpful properties:

| Name          | Type       | Description                                                                            |
| ------------- | ---------- | -------------------------------------------------------------------------------------- |
| `value`       | `Object[]` | All items of the query after processing. The items are instances of the model classes. |
| `hasNextPage` | `Boolean`  | Whether there is a next page. If `false`, `loadMore` won't do anything.                |
| `totalCount`  | `Number`   | The total count of items without pagination                                            |
| `isLoading`   | `Boolean`  | Whether the query is currently fetching data from the server or processing the data.   |

### Queries

For now, we only have the following two queries:

- `allWorkItems`
- `allCases`

However, this will be extended in time. The idea of it is to add queries with
predefined filters, such as e.g `myWorkItems`.

### Options

| Name           | Type                          | Description                                                                                                                                                                 |
| -------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pageSize`     | `Number`                      | This defines the default page size which will be used for the query                                                                                                         |
| `processAll`   | `Function<Promise<Object[]>>` | A function that expects **all** items to be passed and returns a `Promise` that resolves into an array of `Object`s. This function will be used to process all items.       |
| `processNew`   | `Function<Promise<Object[]>>` | Identical to `processAll` but **only new** items (triggered by `loadMore`) will be processed                                                                                |
| `queryOptions` | `Object`                      | Pass options to `apollo.query`. For more information on what options exist, [see here](https://www.apollographql.com/docs/react/api/core/ApolloClient/#ApolloClient.query). |

## Extending

The caluma query layer can be extended in 2 different ways:

1. By passing a `processAll` or `processNew` function to the query
2. By providing a custom model class for a certain type of objects

The first method is already described in [options](#options). This makes
sense if you need all of the data to process your models. An example for this
would be to fetch all users (which are stored in a third party API) that
created a work item at once.

The second method can be used if you want to customize each returned item.
This is useful if you have some kind of custom property, e.g a custom icon
for each task.

To create such a custom model, simply run the following command:

```bash
$ ember generate caluma-data-manager-model work-item
```

This will generate 2 files for you:

- `app/initializers/register-caluma-query-model-work-item.js` This initializier
  registers your custom class for caluma to use. Do not touch this if you don't
  know what you're doing.
- `app/caluma-query/models/work-item.js` This is your custom model where you
  can implement your logic.

## Known Limitations

If the `options` objects on the query is changing (e.g selectable `pageSize`)
the query itself is not being updated yet and will still use the options used
when initialized.
