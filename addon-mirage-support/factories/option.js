import { Factory } from "ember-cli-mirage";

export default Factory.extend({
  slug: i => `option-${i + 1}`,
  label: i => `Option ${i + 1}`,
  meta: JSON.stringify({})
});
