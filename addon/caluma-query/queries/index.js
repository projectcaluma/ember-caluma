import CaseQuery from "./case";
import WorkItemQuery from "./work-item";

export function allWorkItems(options) {
  return new WorkItemQuery(options);
}

export function allCases(options) {
  return new CaseQuery(options);
}

export default { allWorkItems, allCases };
