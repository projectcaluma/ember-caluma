import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { macroCondition, isTesting } from "@embroider/macros";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { timeout, restartableTask, dropTask, task } from "ember-concurrency";
import { useTask } from "ember-resources";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import config from "@projectcaluma/ember-distribution/config";

const toggle = (value, array) => {
  const set = new Set(array);

  set.delete(value) || set.add(value);

  return [...set];
};

export default class CdInquiryNewFormComponent extends Component {
  @service calumaOptions;
  @service notification;
  @service intl;
  @service router;
  @service distribution;

  @queryManager apollo;

  @config config;

  @tracked selectedGroups = [];

  groups = useTask(this, this.fetchGroups, () => [
    this.args.selectedTypes,
    this.args.search,
  ]);

  @action
  updateSelectedTypes(type, e) {
    e.preventDefault();

    this.args.onChangeSelectedTypes(toggle(type, this.args.selectedTypes));
  }

  @action
  updateSelectedGroups(identifier, e) {
    e.preventDefault();

    this.selectedGroups = toggle(identifier, this.selectedGroups);
  }

  @action
  clearSelectedGroups(e) {
    e.preventDefault();

    this.selectedGroups = [];
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

  @dropTask
  *submit(e) {
    e.preventDefault();

    if (!this.selectedGroups.length) return;

    yield this.distribution.createInquiry.perform(this.selectedGroups);

    const lastControlling =
      this.distribution.navigation.value.controlling.edges[0].node;

    // transition to last added inquiry
    this.router.transitionTo(
      "inquiry.detail.index",
      {
        from: lastControlling.controllingGroups[0],
        to: lastControlling.addressedGroups[0],
      },
      decodeId(lastControlling.id)
    );
  }

  @task
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
