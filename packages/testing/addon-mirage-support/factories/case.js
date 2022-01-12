import faker from "@faker-js/faker";
import { Factory } from "miragejs";

const STATUS = ["RUNNING", "COMPLETED", "CANCELED", "SUSPENDED"];

export default Factory.extend({
  id: () => faker.datatype.uuid(),
  createdByUser: () => faker.datatype.uuid(),
  createdAt: () => faker.date.past(),
  modifiedAt: () => faker.date.past(),
  status: () => faker.random.arrayElement(STATUS),
});
