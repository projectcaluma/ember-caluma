import CaseQuery from "@projectcaluma/ember-core/caluma-query/queries/case";
import FormQuery from "@projectcaluma/ember-core/caluma-query/queries/form";
import WorkItemQuery from "@projectcaluma/ember-core/caluma-query/queries/work-item";

export function allWorkItems(options) {
  return new WorkItemQuery(options);
}

export function allCases(options) {
  return new CaseQuery(options);
}

export function allForms(options) {
  return new FormQuery(options);
}

export default { allWorkItems, allCases, allForms };
