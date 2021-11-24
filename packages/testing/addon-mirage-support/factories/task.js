import { Factory } from "ember-cli-mirage";
import faker from "faker";

export default Factory.extend({
  id() {
    return this.slug;
  },
  name: (i) => `Task #${i + 1}`,
  slug: (i) => `task-${i + 1}`,
  type: "SIMPLE",
  createdByUser: () => faker.datatype.uuid(),
  createdAt: () => faker.date.past(),
});
