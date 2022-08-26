import Component from "@glimmer/component";
import { restartableTask, timeout } from "ember-concurrency";

export default class CaFieldSelectorListCaFieldAliasInputComponent extends Component {
  @restartableTask
  *debounceInput(event) {
    yield timeout(500);
    yield this.args.onInput(event.target.value);
  }
}
