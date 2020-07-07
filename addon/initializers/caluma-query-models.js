import WorkItemModel from "ember-caluma/caluma-query/models/work-item";

export function initialize(application) {
  application.register("caluma-query-model:work-item", WorkItemModel);
}

export default {
  initialize,
};
