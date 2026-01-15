import { macroCondition, isTesting } from "@embroider/macros";
import Component from "@glimmer/component";
import { task, timeout } from "ember-concurrency";

export default class CaFieldSelectorListCaFieldAliasInputComponent extends Component {
  debounceInput = task({ restartable: true }, async (event) => {
    if (macroCondition(isTesting())) {
      // no timeout
    } else {
      await timeout(500);
    }

    await this.args.onInput(event.target.value);
  });
}
