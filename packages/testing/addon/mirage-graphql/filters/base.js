import { camelize } from "@ember/string";

export default class BaseFilter {
  constructor(type) {
    this.type = type;
  }

  _getFilterFns(rawFilters) {
    const filters = rawFilters
      .filter((filter) => Object.keys(filter).length !== 0) // filter out empty filters
      .map((filter) => {
        const entries = Object.entries(filter);
        const key = entries[0][0];
        const value = entries[0][1];
        const options = entries
          .slice(1)
          .reduce((opts, [k, v]) => ({ ...opts, [k]: v }), {});

        return { key, value, options };
      });

    return filters.map(({ key, value, options = {} }) => {
      const fn = this[key];

      return typeof fn === "function" && ![null, undefined].includes(value)
        ? (records) => {
            const filteredRecords = fn.call(this, records, value, options);
            return options?.invert
              ? records.filter((record) => !filteredRecords.includes(record))
              : filteredRecords;
          }
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
    return this._getFilterFns(filters?.filter ?? []).reduce(
      (recs, fn) => fn(recs),
      this.sort(records, filters?.order),
    );
  }

  find(records, filters) {
    return this.filter(records, filters)[0] || null;
  }

  slug(records, value) {
    return this.slugs(records, [value]);
  }

  slugs(records, values) {
    return records.filter(({ slug }) => values.includes(slug));
  }

  createdByUser(records, value) {
    return records.filter(({ createdByUser }) => createdByUser === value);
  }

  createdByGroup(records, value) {
    return records.filter(({ createdByGroup }) => createdByGroup === value);
  }

  modifiedByUser(records, value) {
    return records.filter(({ modifiedByUser }) => modifiedByUser === value);
  }

  modifiedByGroup(records, value) {
    return records.filter(({ modifiedByGroup }) => modifiedByGroup === value);
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
        btoa(`${this.type}:${slug}`) === value,
    );
  }

  ids(records, value) {
    if (value === undefined || value === null) {
      return [];
    }

    return records.filter(({ id, slug }) =>
      [id, slug, btoa(`${this.type}:${id}`), btoa(`${this.type}:${slug}`)].some(
        (v) => value.includes(v),
      ),
    );
  }
}
