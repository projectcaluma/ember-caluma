import CaseModel from "ember-caluma/caluma-query/models/case";
import WorkItemModel from "ember-caluma/caluma-query/models/work-item";

export function initialize(application) {
  application.register("caluma-query-model:work-item", WorkItemModel);
  application.register("caluma-query-model:case", CaseModel);
}

export default {
  initialize,
};
