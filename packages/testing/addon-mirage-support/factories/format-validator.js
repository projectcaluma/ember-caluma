import { Factory } from "miragejs";

export default Factory.extend({
  id() {
    return this.slug;
  },
  name: (i) => `Validator #${i + 1}`,
  slug: (i) => `validator-${i + 1}`,
  regex: "/asdf/",
  allowedQuestionTypes: () => ["text", "textarea"],
});
