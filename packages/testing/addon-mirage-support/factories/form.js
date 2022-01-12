import faker from "@faker-js/faker";
import { Factory } from "miragejs";

export default Factory.extend({
  id() {
    return this.slug;
  },
  name: (i) => `Form #${i + 1}`,
  slug: (i) => `form-${i + 1}`,
  description: () => faker.lorem.paragraph(),
  isArchived: false,
  meta: () => ({}),
});
