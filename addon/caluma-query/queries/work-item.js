import BaseQuery from "./base";

export default class WorkItemQuery extends BaseQuery {
  dataKey = "allWorkItems";
  modelName = "work-item";

  get query() {
    return `
      ${this.imports}

      query WorkItemQuery(
        $filter: [WorkItemFilterSetType]
        $order: [WorkItemOrderSetType]
        $cursor: String
        $pageSize: Int
      ) {
        allWorkItems(
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
              ...WorkItemFragment
            }
          }
        }
      }

      fragment WorkItemFragment on WorkItem ${this.modelClass.fragment}
    `;
  }
}
