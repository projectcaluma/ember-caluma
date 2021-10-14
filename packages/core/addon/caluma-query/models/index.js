import cloneDeep from "lodash.clonedeep";
import moment from "moment";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";

export function uuidAttr(target, name) {
  return {
    get() {
      return decodeId(this.raw[name]);
    },
  };
}

export function momentAttr(target, name) {
  return {
    get() {
      const date = moment(this.raw[name]);

      return date.isValid() ? date : null;
    },
    set(value) {
      if (value.isValid()) {
        this.raw[name] = value.toISOString();
      }
    },
  };
}

export default class CalumaQueryModel {
  constructor(raw) {
    // Deep clone the raw object to make sure it's mutable
    this.raw = cloneDeep(raw);

    for (const [key, value] of Object.entries(raw)) {
      if (!(key in this)) {
        this[key] = value;
      }
    }
  }

  @uuidAttr id;
}
