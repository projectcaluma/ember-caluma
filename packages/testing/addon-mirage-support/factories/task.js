import faker from "@faker-js/faker";
import { Factory } from "miragejs";

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
