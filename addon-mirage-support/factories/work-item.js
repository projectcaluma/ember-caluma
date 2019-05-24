import { Factory } from "ember-cli-mirage";
import faker from "faker";

const STATUS = ["READY", "CANCELED", "COMPLETED"];

export default Factory.extend({
  createdByUser: faker.random.uuid(),
  createdAt: faker.date.past(),
  deadline: faker.date.future(),
  status: faker.random.arrayElement(STATUS),
  addressedGroups: () => ["group1", "group2"]
});
