import { Factory, faker } from "ember-cli-mirage";

const TYPES = ["SIMPLE", "COMPLETE_WORKFLOW_FORM", "COMPLETE_TASK_FORM"];

export default Factory.extend({
  name: i => `Task #${i + 1}`,
  slug: i => `task-${i + 1}`,
  type: faker.list.random(...TYPES),
  createdByUser: faker.random.uuid(),
  createdAt: faker.date.past()
});
