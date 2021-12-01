import { camelize } from "@ember/string";

export default class {
  constructor(type, db) {
    this.type = type;
    this.db = db;
  }

  _getFilterFns(rawFilters) {
    const filters = Array.isArray(rawFilters)
      ? // new format
        rawFilters
          .filter((filter) => Object.keys(filter).length !== 0) // filter out empty filters
          .map((filter) => {
            const entries = Object.entries(filter);
            const key = entries[0][0];
            const value = entries[0][1];
            const options = entries
              .slice(1)
              .reduce((opts, [k, v]) => ({ ...opts, [k]: v }), {});

            return { key, value, options };
          })
      : // old format
        Object.entries(rawFilters).map(([key, value]) => ({
          key,
          value,
        }));

    return filters.map(({ key, value, options = {} }) => {
      const fn = this[key];

      return typeof fn === "function"
        ? (records) => fn.call(this, records, value, options)
        : (records) => records;
    });
  }

  sort(records, order) {
    if (!order) return records;

    return records.sort((a, b) => {
      return (
        order
          .map((o) => {
            const attr = camelize(o.attribute.toLowerCase());
            const direction = o.direction === "ASC" ? -1 : 1;

            return (b[attr] - a[attr]) * direction;
          })
          .find((result) => result !== 0) ?? 0
      );
    });
  }

  filter(records, filters) {
    return this._getFilterFns(filters.filter ?? filters).reduce(
      (recs, fn) => fn(recs),
      this.sort(records, filters?.order)
    );
  }

  find(records, filters) {
    return this.filter(records, filters)[0] || null;
  }

  slug(records, value) {
    return records.filter(({ slug }) => slug === value);
  }

  id(records, value) {
    if (value === undefined || value === null) {
      return [];
    }

    return records.filter(
      ({ id, slug }) =>
        id === value ||
        slug === value ||
        btoa(`${this.type}:${id}`) === value ||
        btoa(`${this.type}:${slug}`) === value
    );
  }
}
