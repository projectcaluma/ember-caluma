import { Factory } from "miragejs";

export default Factory.extend({
  id() {
    return this.slug;
  },
  slug: (i) => `option-${i + 1}`,
  label: (i) => `Option ${i + 1}`,
  meta: () => ({}),
  isArchived: false,
});
