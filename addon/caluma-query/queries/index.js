import WorkItemQuery from "./work-item";
import CaseQuery from "./case";

export function allWorkItems(options) {
  return new WorkItemQuery(options);
}

export function allCases(options) {
  return new CaseQuery(options);
}

export default { allWorkItems, allCases };
