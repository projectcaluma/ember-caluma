import BaseFilter from "@projectcaluma/ember-testing/mirage-graphql/filters/base";

export default class WorkItemFilter extends BaseFilter {
  status(records, value) {
    return records.filter(({ status }) => status === value);
  }

  tasks(records, value) {
    return records.filter((record) => value.includes(record.taskId));
  }

  task(records, value) {
    return this.tasks(records, [value]);
  }

  controllingGroups(records, value) {
    return records.filter((record) =>
      value.every((g) => record.controllingGroups?.includes(g)),
    );
  }

  addressedGroups(records, value) {
    return records.filter((record) =>
      value.every((g) => record.addressedGroups?.includes(g)),
    );
  }
}
