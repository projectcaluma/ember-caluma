import { faker } from "@faker-js/faker";
import { Factory } from "miragejs";

const STATUS = ["RUNNING", "COMPLETED", "CANCELED", "SUSPENDED"];

export default Factory.extend({
  id: () => faker.string.uuid(),
  createdByUser: () => faker.string.uuid(),
  createdAt: () => faker.date.past(),
  modifiedAt: () => faker.date.past(),
  status: () => faker.helpers.arrayElement(STATUS),
});
