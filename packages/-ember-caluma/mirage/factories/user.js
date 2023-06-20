import { faker } from "@faker-js/faker";
import { Factory } from "miragejs";

export default Factory.extend({
  firstName: () => faker.person.firstName(),
  lastName: () => faker.person.lastName(),
});
