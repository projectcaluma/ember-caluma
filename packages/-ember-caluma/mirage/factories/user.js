import { Factory } from "ember-cli-mirage";
import faker from "faker";

export default Factory.extend({
  firstName: () => faker.name.firstName(),
  lastName: () => faker.name.lastName(),
});
