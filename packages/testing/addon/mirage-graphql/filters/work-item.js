import BaseFilter from "@projectcaluma/ember-testing/mirage-graphql/filters/base";

export default class extends BaseFilter {
  status(records, value, { invert = false }) {
    return records.filter(({ status }) => invert !== (status === value));
  }

  tasks(records, value) {
    const taskIds = this.db.tasks
      .filter(({ slug }) => value.includes(slug))
      .map(({ id }) => id);

    return records.filter(({ taskId }) => taskIds.includes(taskId));
  }

  task(records, value) {
    return this.tasks(records, [value]);
  }

  controllingGroups(records, value, { invert = false }) {
    return records.filter((record) =>
      value.every((g) => invert !== record.controllingGroups.includes(g))
    );
  }

  addressedGroups(records, value, { invert = false }) {
    return records.filter((record) =>
      value.every((g) => invert !== record.addressedGroups.includes(g))
    );
  }
}
