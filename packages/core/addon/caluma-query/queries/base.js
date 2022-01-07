import { getOwner, setOwner } from "@ember/application";
import { assert } from "@ember/debug";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import {
  enqueueTask,
  lastValue,
  restartableTask,
  task,
} from "ember-concurrency";
import { gql } from "graphql-tag";

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
      `caluma-query-model:${this.modelName}`
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
    const Model = getOwner(this).factoryFor(
      `caluma-query-model:${this.modelName}`
    ).class;

    return this.items.map((item) => {
      const instance = new Model(item);

      setOwner(instance, getOwner(this));

      return instance;
    });
  }

  fetch(...args) {
    return this._fetch.perform(...args);
  }

  fetchMore(...args) {
    return this._fetchMore.perform(...args);
  }

  @restartableTask
  *_fetch({ filter = [], order = [], queryOptions = {} } = {}) {
    yield this._fetchPage.cancelAll({ resetState: true });

    this.items = [];

    this.filter = filter;
    this.order = order;
    this.queryOptions = { ...(this.queryOptions ?? {}), ...queryOptions };

    return yield this._fetchPage.linked().perform();
  }

  @enqueueTask
  *_fetchMore() {
    if (!this._data) return;

    return yield this._fetchPage.linked().perform();
  }

  @lastValue("_fetchPage") _data;
  @task
  *_fetchPage() {
    const data = yield this.apollo.query({
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

    this.items = yield this.processAll([
      ...this.items,
      ...(yield this.processNew(
        data[this.dataKey].edges.map(({ node }) => node)
      )),
    ]);

    return data;
  }
}
