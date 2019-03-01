import { Factory, faker } from "ember-cli-mirage";

const STATUS = ["READY", "CANCELED", "COMPLETED"];

export default Factory.extend({
  createdByUser: faker.random.uuid(),
  createdAt: faker.date.past(),
  deadline: faker.date.future(),
  status: faker.list.random(...STATUS),
  // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
  addressedGroups: ["group1", "group2"]
});
