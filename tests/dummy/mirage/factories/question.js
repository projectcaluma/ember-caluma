import { Factory, faker } from "ember-cli-mirage";

const TYPES = ["TEXT", "TEXTAREA", "NUMBER", "CHECKBOX", "RADIO"];

export default Factory.extend({
  slug: i => `question-${i + 1}`,
  label: () => `${faker.lorem.sentence().replace(/\.$/, "")}?`,
  type: () => faker.list.random(...TYPES),
  isRequired: () => faker.random.boolean().toString(),
  isHidden: "false",
  meta: JSON.stringify({})
});
