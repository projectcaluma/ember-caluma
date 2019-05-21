import { Factory, faker } from "ember-cli-mirage";

export default Factory.extend({
  name: i => `Form #${i + 1}`,
  slug: i => `form-${i + 1}`,
  description: () => faker.lorem.paragraph(),
  isArchived: false,
  meta: () => ({})
});
