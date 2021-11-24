import BaseFilter from "@projectcaluma/ember-testing/mirage-graphql/filters/base";

export default class extends BaseFilter {
  status(records, value) {
    return records.filter(({ status }) => status === value);
  }

  task(records, value) {
    const task = this.db.tasks.findBy({ slug: value });

    return records.filter((record) => record.taskId === task?.id);
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
