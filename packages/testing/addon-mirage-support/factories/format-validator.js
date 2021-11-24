import { Factory } from "ember-cli-mirage";
import faker from "faker";

export default Factory.extend({
  id() {
    return this.slug;
  },
  name: (i) => `Validator #${i + 1}`,
  slug: (i) => `validator-${i + 1}`,
  errorMsg: () => faker.lorem.paragraph(),
  regex: "/asdf/",
});
