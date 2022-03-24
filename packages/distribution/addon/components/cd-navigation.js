import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";

import config from "@projectcaluma/ember-distribution/config";
import uniqueByGroups from "@projectcaluma/ember-distribution/utils/unique-by-groups";

export default class CdNavigationComponent extends Component {
  @service("-scheduler") scheduler;
  @service calumaOptions;
  @service distribution;

  @config config;

  @queryManager apollo;

  get inquiries() {
    const findGroupName = (identifiers) => {
      const group = this.scheduler.groupCache.find((group) =>
        identifiers
          .map(String)
          .includes(String(group[this.calumaOptions.groupIdentifierProperty]))
      );

      return group?.[this.calumaOptions.groupNameProperty] ?? "";
    };

    return Object.entries(this.distribution.navigation.value ?? {}).reduce(
      (inquiries, [key, objects]) => {
        return {
          ...inquiries,
          // Don't return any data until the internal scheduler has cached
          // groups since we don't want to render empty navigation items
          [key]: this.scheduler.groupCache.length
            ? uniqueByGroups(
                objects.edges.map((edge) => ({
                  ...edge.node,
                  // Populate the work item with the names of the involved
                  // groups so the <DistributionNavigation::Section /> component
                  // can sort by them
                  addressedGroupName: findGroupName(edge.node.addressedGroups),
                  controllingGroupName: findGroupName(
                    edge.node.controllingGroups
                  ),
                }))
              )
            : [],
        };
      },
      {}
    );
  }
}
