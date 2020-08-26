import Component from "@ember/component";
import { inject as service } from "@ember/service";
import layout from "../templates/components/cfb-navigation";
import { getOwner } from "@ember/application";

export default Component.extend({
  layout,
  navigation: service(),
  router: service(),
  maxItems: 3,
  tagName: "ul",
  classNames: [
    "uk-breadcrumb",
    "uk-text-large",
    "uk-width-1-1",
    "uk-flex",
    "uk-flex-nowrap",
  ],

  actions: {
    navigate([routeName, ...params]) {
      const mountPoint = getOwner(this).mountPoint;

      this.router.transitionTo(
        routeName === "application" ? mountPoint : `${mountPoint}.${routeName}`,
        ...params
      );
    },
  },
});
