import { Factory, faker } from "ember-cli-mirage";

const STATUS = ["READY", "CANCELED", "COMPLETED"];

export default Factory.extend({
  createdByUser: faker.random.uuid(),
  createdAt: faker.date.past(),
  status: faker.list.random(...STATUS)
});
