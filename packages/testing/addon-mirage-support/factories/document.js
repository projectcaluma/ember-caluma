import { Factory } from "ember-cli-mirage";
import faker from "faker";

export default Factory.extend({
  id: () => faker.datatype.uuid(),
});
