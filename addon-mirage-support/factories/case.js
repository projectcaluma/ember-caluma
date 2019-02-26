import { Factory, faker } from "ember-cli-mirage";

export default Factory.extend({
  createdByUser: faker.random.uuid(),
  createdAt: faker.date.past()
});
