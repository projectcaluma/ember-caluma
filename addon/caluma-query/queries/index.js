import CaseQuery from "./case";
import FormQuery from "./form";
import WorkItemQuery from "./work-item";

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
