import { Factory, faker } from "ember-cli-mirage";
import slugify from "slugify";

export default Factory.extend({
  name: i => `Form #${i + 1}`,
  description: () => faker.lorem.paragraph(),
  isArchived: false,
  meta: JSON.stringify({}),

  slug() {
    return slugify(this.name, { lower: true });
  }
});
