import { Factory } from "ember-cli-mirage";
import faker from "faker";

const TYPES = ["SIMPLE", "COMPLETE_WORKFLOW_FORM", "COMPLETE_TASK_FORM"];

export default Factory.extend({
  name: (i) => `Task #${i + 1}`,
  slug: (i) => `task-${i + 1}`,
  type: faker.random.arrayElement(TYPES),
  createdByUser: faker.random.uuid(),
  createdAt: faker.date.past(),
});
