import { Factory, faker } from "ember-cli-mirage";
import slug from "slug";

export default Factory.extend({
  name: () => faker.lorem.sentence(),
  description: () => faker.lorem.paragraph(),
  meta: JSON.stringify({}),

  slug() {
    return slug(this.name.toLowerCase());
  }
});
