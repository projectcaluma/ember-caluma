import faker from "@faker-js/faker";
import { Factory } from "miragejs";

const STATUS = ["READY", "CANCELED", "COMPLETED", "SKIPPED", "SUSPENDED"];

export default Factory.extend({
  id: () => faker.datatype.uuid(),
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
