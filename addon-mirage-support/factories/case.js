import { Factory } from "ember-cli-mirage";
import faker from "faker";

const STATUS = ["RUNNING", "COMPLETED", "CANCELED"];

export default Factory.extend({
  createdByUser: faker.random.uuid(),
  createdAt: faker.date.past(),
  modifiedAt: faker.date.past(),
  status: faker.random.arrayElement(STATUS)
});
