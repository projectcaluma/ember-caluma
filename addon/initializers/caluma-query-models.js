import WorkItemModel from "ember-caluma/caluma-query/models/work-item";
import CaseModel from "ember-caluma/caluma-query/models/case";

export function initialize(application) {
  application.register("caluma-query-model:work-item", WorkItemModel);
  application.register("caluma-query-model:case", CaseModel);
}

export default {
  initialize,
};
