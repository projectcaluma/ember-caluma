import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

export default class CfbNavigationComponent extends Component {
  @service router;
  @service("-routing") routing; // eslint-disable-line ember/no-private-routing-service

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
    const fullRouteName = [...routeParts.slice(0, index), routeName].join(".");

    const engineInfo = this.routing.router._engineInfoByRoute[fullRouteName];

    if (!engineInfo) {
      return null;
    }

    return this.routing.router
      ._getEngineInstance(engineInfo)
      .lookup(`route:${engineInfo.localFullName}`);
  }
}
