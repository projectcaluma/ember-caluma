export default function uniqueByGroups(workItems) {
  return [
    ...new Map(
      workItems
        .filter((workItem) => workItem.status !== "CANCELED")
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
