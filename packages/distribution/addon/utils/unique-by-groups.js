export default function uniqueByGroups(workItems) {
  return [
    ...new Map(
      workItems
        .map((workItem) => {
          return [
            JSON.stringify({
              from: workItem.controllingGroups,
              to: workItem.addressedGroups,
            }),
            workItem,
          ];
        })
        .reverse()
    ).values(),
  ];
}
