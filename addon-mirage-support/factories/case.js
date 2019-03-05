import { Factory, faker } from "ember-cli-mirage";

const STATUS = ["RUNNING", "COMPLETED", "CANCELED"];

export default Factory.extend({
  createdByUser: faker.random.uuid(),
  createdAt: faker.date.past(),
  modifiedAt: faker.date.past(),
  status: faker.list.random(...STATUS)
});
