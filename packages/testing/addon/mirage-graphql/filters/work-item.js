import BaseFilter from "@projectcaluma/ember-testing/mirage-graphql/filters/base";

export default class extends BaseFilter {
  status(records, value, { invert = false }) {
    return records.filter(({ status }) => invert !== (status === value));
  }

  tasks(records, value, { invert = false }) {
    return records.filter((record) => invert !== value.includes(record.taskId));
  }

  task(records, value, { invert = false }) {
    return this.tasks(records, [value], { invert });
  }

  controllingGroups(records, value, { invert = false }) {
    return records.filter((record) =>
      value.every((g) => invert !== record.controllingGroups?.includes(g))
    );
  }

  addressedGroups(records, value, { invert = false }) {
    return records.filter((record) =>
      value.every((g) => invert !== record.addressedGroups?.includes(g))
    );
  }
}
