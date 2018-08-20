import Component from "@ember/component";
import layout from "../templates/components/cfb-form-list";
import { task } from "ember-concurrency";
import gql from "graphql-tag";
import { ComponentQueryManager } from "ember-apollo-client";

const query = gql`
  query Forms {
    allForms {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }
`;

/**
 * This component displays a list of forms. It can either be used blockless,
 * where every row fires the `on-edit-form` action - or you can provide a
 * content block.
 *
 * ```handlebars
 * {{!-- Blockless --}}
 *
 * {{cfb-form-list on-edit-form=(action 'someAction')}}
 *
 * {{!-- With block style --}}
 * {{#cfb-form-list as |table|}}
 *   {{#table.thead}}
 *     <tr>
 *       <th>Key</th>
 *     </tr>
 *   {{/table.thead}}
 *
 *   {{#table.body as |row|}}
 *     <tr {{action 'someAction' on='click'}}>
 *       <td>{{row.key}}</td>
 *     </tr>
 *   {{/table.body}}
 * {{#cfb}}
 * ```
 */
export default Component.extend(ComponentQueryManager, {
  layout,

  data: task(function*() {
    return yield this.get("apollo").watchQuery(
      {
        query,
        variables: {},
        fetchPolicy: "cache-and-network"
      },
      "allForms.edges"
    );
  }).on("init")
});
