import Component from "@ember/component";
import layout from "../templates/components/cfb-form-list";

/**
 * This component displays a list of forms. It can either be used blockless,
 * where every row fires the `on-edit-form` action - or you can provide a
 * content block.
 *
 * ```handlebars
 * {{!-- Blockless --}}
 *
 * {{cfb-form-list data=someTask on-edit-form=(action 'someAction')}}
 *
 * {{!-- With block style --}}
 * {{#cfb-form-list data=someTask as |table|}}
 *   {{#table.thead}}
 *     <th>Name</th>
 *   {{/table.thead}}
 *
 *   {{#table.body as |row|}}
 *     <tr>
 *       <td>{{row.name}}</td>
 *     </tr>
 *   {{/table.body}}
 *   <tr>
 *
 *   </tr>
 * {{#cfb}}
 * ```
 */
export default Component.extend({
  layout,

  classNames: ["uk-table", "uk-table-striped", "uk-table-hover"]
});
