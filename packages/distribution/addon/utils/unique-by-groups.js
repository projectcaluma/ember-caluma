export default function uniqueByGroups(workItems) {
  const relevantWorkItems = workItems
    .filter((workItem) => workItem.status !== "CANCELED")
    .map((workItem) => ({
      ...workItem,
      identifier: JSON.stringify({
        from: workItem.controllingGroups,
        to: workItem.addressedGroups,
      }),
    }));

  return [
    ...new Map(
      relevantWorkItems
        .map((workItem) => {
          const workItemsWithSameIdentifier = relevantWorkItems.filter(
            (otherWorkItem) => otherWorkItem.identifier === workItem.identifier,
          );

          return [
            workItem.identifier,
            {
              ...workItem,
              totalCount: workItemsWithSameIdentifier.length,
              answeredCount: workItemsWithSameIdentifier.filter((wi) =>
                ["COMPLETED", "SKIPPED"].includes(wi.status),
              ).length,
            },
          ];
        })
        .reverse(),
    ).values(),
  ];
}
