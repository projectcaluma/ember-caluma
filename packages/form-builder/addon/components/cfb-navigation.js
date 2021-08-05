import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

export default class CfbNavigationComponent extends Component {
  // eslint-disable-next-line ember/no-private-routing-service
  @service("-routing") routing;
  @service router;

  get _routes() {
    const currentRoute = this.router.currentRouteName;
    if (!currentRoute) return [];

    const routeParts = currentRoute.split(".");
    return routeParts
      .map((routeName, index) =>
        this._lookupRoute(routeName, routeParts, index)
      )
      .filter((route) => route && route.__navigationTitleProperty);
  }

  get crumbs() {
    return this._routes.map((route) => ({
      routeName: route.routeName,
      disabled: this.router.currentRouteName === route.fullRouteName,
      title: route[route.__navigationTitleProperty],
    }));
  }

  _lookupRoute(routeName, routeParts, index) {
    // construct the full route name from the splitted current route name
    const fullRouteName = [...routeParts.slice(0, index), routeName].join(".");

    // get the engine info for the route from the internal routing service. this
    // information is not available on the public router service which is why we
    // need this one. this is heavily inspired by ember-crumbly, in case
    // something breaks, check out what they did to fix it.
    const engineInfo = this.routing.router._engineInfoByRoute[fullRouteName];

    if (!engineInfo) {
      return null;
    }

    // resolve the route using the engine info
    return this.routing.router
      ._getEngineInstance(engineInfo)
      .lookup(`route:${engineInfo.localFullName}`);
  }
}
