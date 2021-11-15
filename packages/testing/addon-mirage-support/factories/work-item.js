import { Factory } from "ember-cli-mirage";
import faker from "faker";

const STATUS = ["READY", "CANCELED", "COMPLETED", "SKIPPED", "SUSPENDED"];

export default Factory.extend({
  name: () => faker.lorem.words(5),
  createdByUser: () => faker.datatype.uuid(),
  createdAt: () => faker.date.past(),
  deadline: () => faker.date.future(),
  status: () => faker.random.arrayElement(STATUS),
  addressedGroups: () => ["group1", "group2"],
  closedAt() {
    return STATUS.filter((s) => s !== "READY").includes(this.status)
      ? faker.date.past()
      : null;
  },
});
