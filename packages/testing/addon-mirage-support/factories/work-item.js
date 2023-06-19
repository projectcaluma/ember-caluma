import { faker } from "@faker-js/faker";
import { Factory } from "miragejs";

const STATUS = ["READY", "CANCELED", "COMPLETED", "SKIPPED", "SUSPENDED"];

export default Factory.extend({
  id: () => faker.string.uuid(),
  name: () => faker.lorem.words(5),
  createdByUser: () => faker.string.uuid(),
  createdAt: () => faker.date.past(),
  deadline: () => faker.date.future(),
  status: () => faker.helpers.arrayElement(STATUS),
  addressedGroups: () => ["group1", "group2"],
  assignedUsers: () => ["1"],
  closedAt() {
    return STATUS.filter((s) => s !== "READY").includes(this.status)
      ? faker.date.past()
      : null;
  },
  isRedoable: () => false,
});
