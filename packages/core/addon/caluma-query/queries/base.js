import { getOwner, setOwner } from "@ember/application";
import { assert } from "@ember/debug";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import { gql } from "graphql-tag";
import { TrackedArray } from "tracked-built-ins";

export default class BaseQuery {
  @queryManager apollo;

  @tracked items = [];

  constructor({
    pageSize = null,
    processNew = async (items) => items,
    processAll = async (items) => items,
    queryOptions = {},
  }) {
    this.pageSize = pageSize;
    this.processNew = processNew;
    this.processAll = processAll;
    this.queryOptions = queryOptions;
  }

  get query() {
    return assert("`query` must be implemented on the model");
  }

  get pagination() {
    return `
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    `;
  }

  get modelClass() {
    const factory = getOwner(this).factoryFor(
      `caluma-query-model:${this.modelName}`,
    );

    return factory.class;
  }

  get isLoading() {
    return this._fetch.isRunning || this._fetchMore.isRunning;
  }

  get totalCount() {
    return this._data?.[this.dataKey].totalCount;
  }

  get hasNextPage() {
    return this._data?.[this.dataKey].pageInfo.hasNextPage;
  }

  get cursor() {
    return this._data?.[this.dataKey].pageInfo.endCursor;
  }

  get value() {
    return this.items;
  }

  fetch(...args) {
    return this._fetch.perform(...args);
  }

  fetchMore(...args) {
    return this._fetchMore.perform(...args);
  }

  refresh() {
    // This peforms the fetch task with the current arguments which will result
    // in a refresh of the base query. `queryOptions` is explicitly not being
    // passed as this is merged with `this.queryOptions` in the task anyways.
    return this._fetch.perform({ filter: this.filter, order: this.order });
  }

  _fetch = task(
    { restartable: true },
    async ({ filter = [], order = [], queryOptions = {} } = {}) => {
      await this._fetchPage.cancelAll({ resetState: true });

      this.items = new TrackedArray();

      this.filter = filter;
      this.order = order;
      this.queryOptions = { ...(this.queryOptions ?? {}), ...queryOptions };

      return await this._fetchPage.linked().perform();
    },
  );

  _fetchMore = task({ enqueue: true }, async () => {
    if (!this._data) return;

    return await this._fetchPage.linked().perform();
  });

  get _data() {
    return this._fetchPage.lastSuccessful?.value;
  }

  _fetchPage = task(async () => {
    const data = await this.apollo.query({
      query: gql`
        ${this.query}
      `,
      variables: {
        filter: this.filter,
        order: this.order,
        pageSize: this.pageSize,
        cursor: this.cursor,
      },
      fetchPolicy: "network-only",
      ...this.queryOptions,
    });

    const rawNewItems = data[this.dataKey].edges.map(({ node }) => node);

    await this.#parsePage(rawNewItems);

    return data;
  });

  #createModel(item) {
    const instance = new this.modelClass(item);
    setOwner(instance, getOwner(this));
    return instance;
  }

  async #parsePage(rawNewItems) {
    const processedNewItems = await this.processNew(rawNewItems);
    const rawExistingItems = this.items.map((model) => model.raw);

    const allRawItems = [...processedNewItems, ...rawExistingItems];
    const allProcessedItems = await this.processAll(allRawItems);

    // Superficially check if `this.processAll` changed anything on the raw data
    if (JSON.stringify(allRawItems) !== JSON.stringify(allProcessedItems)) {
      // If so, we need to re-create the already existing models and reassign
      // the `this.items` property in order to trigger a rerender for **all**
      // items.
      this.items = new TrackedArray(
        allProcessedItems.map((i) => this.#createModel(i)),
      );
    } else {
      // If not, only the newly added items need to be converted to models and
      // added to the existing items in order to only trigger a partial rerender
      // for the newly added items.
      this.items.push(...processedNewItems.map((i) => this.#createModel(i)));
    }
  }
}
