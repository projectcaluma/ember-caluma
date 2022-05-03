import { faker } from "@faker-js/faker";
import { Factory } from "miragejs";

export default Factory.extend({
  id: () => faker.datatype.uuid(),
  modifiedContentByUser: () => faker.datatype.uuid(),
  modifiedContentAt: () => faker.date.past(),
});
