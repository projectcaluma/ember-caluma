export default class {
  constructor(type, collection, db) {
    this.type = type;
    this.collection = collection;
    this.db = db;
  }

  _getFilterFns(filters) {
    return Object.entries(filters).map(([name, value]) => {
      const fn = this[name];

      return typeof fn === "function"
        ? (records) => fn.call(this, records, value)
        : (records) => records;
    });
  }

  filter(records, filters) {
    // flatten array of filters to find filter functions
    const filterObj = Array.isArray(filters)
      ? filters.length
        ? Object.assign(...filters)
        : {}
      : filters;

    return this._getFilterFns(filterObj).reduce(
      (recs, fn) => fn(recs),
      records
    );
  }

  find(records, filters) {
    return (
      this._getFilterFns(filters).reduce((recs, fn) => fn(recs), records)[0] ||
      null
    );
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
