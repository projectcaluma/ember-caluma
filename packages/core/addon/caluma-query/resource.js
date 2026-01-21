import { getOwner, setOwner } from "@ember/application";
import { destroy, registerDestructor } from "@ember/destroyable";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { Resource } from "ember-modify-based-class-resource";

const MUTABLE_OPTIONS = [
  "pageSize",
  "processAll",
  "processNew",
  "queryOptions",
];

export default class CalumaQueryResource extends Resource {
  @tracked query;

  didSetup = false;

  constructor(owner, args) {
    super(owner, args);

    registerDestructor(this, () => {
      destroy(this.query);
    });
  }

  modify(_, { options = {}, query, ...args }) {
    if (!this.didSetup) {
      // initialize the caluma query with the given options
      this.query = query(options);
      setOwner(this.query, getOwner(this));

      this.didSetup = true;
    } else {
      // update changed options on the caluma query
      MUTABLE_OPTIONS.forEach((optionKey) => {
        const option = options[optionKey];

        if (option !== undefined && option !== this.query[optionKey]) {
          this.query[optionKey] = option;
        }
      });
    }

    this.query.fetch(args);
  }

  @action
  fetchMore(event) {
    if (event instanceof Event) {
      event.preventDefault();
    }

    return this.query.fetchMore();
  }

  @action
  refresh(event) {
    if (event instanceof Event) {
      event.preventDefault();
    }

    return this.query.refresh();
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
