import { Factory, faker } from "ember-cli-mirage";

const TYPES = ["text", "textarea", "number", "checkbox", "radio"];

export default Factory.extend({
  slug: i => `question-${i + 1}`,
  label: () => `${faker.lorem.sentence().replace(/\.$/, "")}?`,
  type: () => faker.list.random(...TYPES),
  meta: JSON.stringify({})
});
