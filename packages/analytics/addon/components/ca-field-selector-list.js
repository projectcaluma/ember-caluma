import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class CaFieldSelectorListComponent extends Component {
  @action
  updateFieldPath(id, alias, selection) {
    this.args.onUpdate({ id, alias, dataSource: selection });
  }

  @action
  updateFieldDescription(field, props) {
    this.args.onUpdate({ ...field, ...props });
  }

  @action
  removeField(id) {
    this.args.onDelete({ id });
  }
}
