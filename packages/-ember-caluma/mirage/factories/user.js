import { faker } from "@faker-js/faker";
import { Factory } from "miragejs";

export default Factory.extend({
  firstName: () => faker.name.firstName(),
  lastName: () => faker.name.lastName(),
});
