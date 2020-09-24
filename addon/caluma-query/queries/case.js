import BaseQuery from "./base";

export default class CaseQuery extends BaseQuery {
  dataKey = "allCases";
  modelName = "case";

  get query() {
    return `
      query CaseQuery(
        $filter: [CaseFilterSetType]
        $order: [CaseOrderSetType]
        $cursor: String
        $pageSize: Int
      ) {
        allCases(
          filter: $filter
          order: $order
          after: $cursor
          first: $pageSize
        ) {
          ${this.pagination}
          edges {
            cursor
            node {
              id
              __typename
              ...CaseFragment
            }
          }
        }
      }

      fragment CaseFragment on Case ${this.modelClass.fragment}
    `;
  }
}
