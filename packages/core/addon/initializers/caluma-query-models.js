import CaseModel from "@projectcaluma/ember-core/caluma-query/models/case";
import FormModel from "@projectcaluma/ember-core/caluma-query/models/form";
import WorkItemModel from "@projectcaluma/ember-core/caluma-query/models/work-item";

export function initialize(application) {
  application.register("caluma-query-model:work-item", WorkItemModel);
  application.register("caluma-query-model:case", CaseModel);
  application.register("caluma-query-model:form", FormModel);
}

export default {
  initialize,
};
