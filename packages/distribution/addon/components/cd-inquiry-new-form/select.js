import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { macroCondition, isTesting } from "@embroider/macros";
import Component from "@glimmer/component";
import { timeout, restartableTask } from "ember-concurrency";
import { trackedTask } from "ember-resources/util/ember-concurrency";

import config from "@projectcaluma/ember-distribution/config";

const toggle = (value, array) => {
  const set = new Set(array);

  set.delete(value) || set.add(value);

  return [...set];
};

export default class CdInquiryNewFormSelectComponent extends Component {
  @service calumaOptions;

  @config config;

  groups = trackedTask(this, this.fetchGroups, () => [
    this.args.selectedTypes,
    this.args.search,
  ]);

  @action
  updateSelectedTypes(type, e) {
    e.preventDefault();

    this.args.onChangeSelectedTypes(toggle(type, this.args.selectedTypes));
  }

  @action
  updateSelectedGroups(identifier) {
    this.args.onChangeSelectedGroups(
      toggle(identifier, this.args.selectedGroups)
    );
  }

  @restartableTask
  *updateSearch(e) {
    e.preventDefault();

    /* istanbul ignore next */
    if (macroCondition(isTesting())) {
      // no timeout
    } else {
      yield timeout(500);
    }

    this.args.onChangeSearch(e.target.value);
  }

  @restartableTask
  *fetchGroups(types, search) {
    // https://github.com/ember-cli/eslint-plugin-ember/issues/1413
    yield Promise.resolve();

    const typedGroups = yield this.calumaOptions.fetchTypedGroups(
      types,
      search
    );

    return Object.entries(typedGroups)
      .flatMap(([type, groups]) => {
        return groups.map((group) => ({
          identifier: group[this.calumaOptions.groupIdentifierProperty],
          name: group[this.calumaOptions.groupNameProperty],
          config: this.config.new.types[type],
        }));
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
