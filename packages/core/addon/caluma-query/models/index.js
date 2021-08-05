import moment from "moment";

export function uuidAttr(...args) {
  const decorate = function (_, name) {
    return {
      get() {
        return atob(this.raw[name]).split(":")[1];
      },
    };
  };

  if (args.length === 3) {
    return decorate(...args);
  }

  return decorate;
}

export function momentAttr(...args) {
  const decorate = function (_, name) {
    return {
      get() {
        const date = moment(this.raw[name]);

        return date.isValid() ? date : null;
      },
      set(value) {
        if (value.isValid()) {
          this.raw[name] = value.toISOString();
        }

        return value;
      },
    };
  };

  if (args.length === 3) {
    return decorate(...args);
  }

  return decorate;
}

export default class CalumaQueryModel {
  constructor(raw) {
    this.raw = raw;

    for (const [key, value] of Object.entries(raw)) {
      if (!(key in this)) {
        this[key] = value;
      }
    }
  }

  @uuidAttr id;
}
