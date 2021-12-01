import { Factory } from "ember-cli-mirage";

export default Factory.extend({
  id() {
    return this.slug;
  },
  name: (i) => `Workflow #${i + 1}`,
  slug: (i) => `workflow-${i + 1}`,
});
