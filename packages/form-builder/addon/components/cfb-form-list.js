import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { timeout, restartableTask } from "ember-concurrency";

import { useCalumaQuery } from "@projectcaluma/ember-core/caluma-query";
import { allForms } from "@projectcaluma/ember-core/caluma-query/queries";

export default class ComponentsCfbFormListComponent extends Component {
  formsQuery = useCalumaQuery(this, allForms, () => ({
    options: { pageSize: 20 },
    filter: this.filter,
    order: [{ attribute: "NAME", direction: "ASC" }],
  }));

  @tracked category = "active";
  @tracked search = "";

  get filter() {
    const isArchived =
      this.category === "active"
        ? { isArchived: false }
        : this.category === "archived"
        ? { isArchived: true }
        : null;

    const search = this.search ? { search: this.search } : null;

    return [isArchived, search].filter(Boolean) || null;
  }

  @restartableTask
  *setFilter(name, eventOrValue) {
    yield timeout(500);

    this[name] =
      eventOrValue instanceof Event ? eventOrValue.target.value : eventOrValue;
  }
}
