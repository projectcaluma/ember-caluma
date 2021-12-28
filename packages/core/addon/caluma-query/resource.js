import { getOwner, setOwner } from "@ember/application";
import { destroy } from "@ember/destroyable";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { LifecycleResource } from "ember-resources";

export default class CalumaQueryResource extends LifecycleResource {
  @tracked query;

  setup() {
    const { query, options, queryArgs } = this._parsedArgs;

    this.query = query(options);
    setOwner(this.query, getOwner(this));

    this.query.fetch(queryArgs);
  }

  update() {
    this._updateOptions();

    this.query.fetch(this._parsedArgs.queryArgs);
  }

  teardown() {
    destroy(this.query);
  }

  get _parsedArgs() {
    const { query, options = {}, ...queryArgs } = this.args.named;

    return { query, options, queryArgs };
  }

  _updateOptions() {
    ["pageSize", "processAll", "processNew", "queryOptions"].forEach(
      (optionKey) => {
        const option = this._parsedArgs.options[optionKey];

        if (option !== undefined && option !== this.query[optionKey]) {
          this.query[optionKey] = option;
        }
      }
    );
  }

  @action
  fetchMore(event) {
    if (event instanceof Event) {
      event.preventDefault();
    }

    this.query.fetchMore();
  }

  get value() {
    return this.query.value;
  }

  get hasNextPage() {
    return this.query.hasNextPage;
  }

  get totalCount() {
    return this.query.totalCount;
  }

  get isLoading() {
    return this.query.isLoading;
  }
}
