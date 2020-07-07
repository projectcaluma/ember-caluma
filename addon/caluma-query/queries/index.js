import WorkItemQuery from "./work-item";

export function allWorkItems(options) {
  return new WorkItemQuery(options);
}

export default { allWorkItems };
