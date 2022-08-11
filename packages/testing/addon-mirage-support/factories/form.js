import { faker } from "@faker-js/faker";
import { Factory } from "miragejs";

export default Factory.extend({
  id() {
    return this.slug;
  },
  name: (i) => `Form #${i + 1}`,
  slug: (i) => `form-${i + 1}`,
  description: () => faker.lorem.paragraph(),
  isArchived: false,
  isPublished: true,
  meta: () => ({}),
  createdByUser: () => faker.random.numeric(10),
  createdByGroup: () => faker.random.numeric(10),
  modifiedByUser: () => faker.random.numeric(10),
  modifiedByGroup: () => faker.random.numeric(10),
});
