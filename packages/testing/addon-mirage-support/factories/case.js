import { Factory } from "ember-cli-mirage";
import faker from "faker";
import moment from "moment";

const STATUS = ["RUNNING", "COMPLETED", "CANCELED", "SUSPENDED"];

export default Factory.extend({
  createdByUser: () => faker.datatype.uuid(),
  createdAt: () => moment(faker.date.past()).utc().format(),
  modifiedAt: () => moment(faker.date.past()).utc().format(),
  status: () => faker.random.arrayElement(STATUS),
});
