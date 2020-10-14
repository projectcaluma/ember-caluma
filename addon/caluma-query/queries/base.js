import { queryManager } from "ember-apollo-client";
import { tracked } from "@glimmer/tracking";
import gql from "graphql-tag";
import { getOwner, setOwner } from "@ember/application";
import { assert } from "@ember/debug";

export default class BaseQuery {
  @queryManager apollo;

  @tracked items = [];

  @tracked totalCount = 0;
  @tracked hasNextPage = true;

  @tracked isLoading = true;

  constructor({
    pageSize = null,
    processNew = async (items) => items,
    processAll = async (items) => items,
    queryOptions = {},
  }) {
    this.pageSize = pageSize;
    this.cursor = null;

    this.processNew = processNew;
    this.processAll = processAll;
    this.queryOptions = queryOptions;
  }

  get query() {
    assert("`query` must be implemented on the model");

    return "";
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

  fetch({ filter = [], order = [], queryOptions = {} } = {}) {
    this.items = [];
    this.totalCount = 0;
    this.hasNextPage = true;
    this.cursor = null;

    this.filter = filter;
    this.order = order;
    this.queryOptions = { ...(this.queryOptions ?? {}), ...queryOptions };

    return this.fetchMore();
  }

  async fetchMore() {
    if (this.hasNextPage) {
      this.isLoading = true;

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

      this.cursor = data[this.dataKey].pageInfo.endCursor;

      this.hasNextPage = data[this.dataKey].pageInfo.hasNextPage;
      this.totalCount = data[this.dataKey].totalCount;

      const rawItems = data[this.dataKey].edges.map(({ node }) => node);

      this.items = await this.processAll([
        ...this.items,
        ...(await this.processNew(rawItems)),
      ]);

      this.isLoading = false;
    }
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
}
