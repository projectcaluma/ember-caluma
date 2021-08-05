import BaseQuery from "@projectcaluma/ember-core/caluma-query/queries/base";

export default class FormQuery extends BaseQuery {
  dataKey = "allForms";
  modelName = "form";

  get query() {
    return `
      query (
        $filter: [FormFilterSetType],
        $order: [FormOrderSetType],
        $pageSize: Int,
        $cursor: String
      ) {
        allForms(
          filter: $filter,
          order: $order,
          first: $pageSize,
          after: $cursor,
        ) {
          ${this.pagination}
          edges {
            node {
              id
              __typename
              ...FormFragment
            }
          }
        }
      }

      fragment FormFragment on Form ${this.modelClass.fragment}

    `;
  }
}
