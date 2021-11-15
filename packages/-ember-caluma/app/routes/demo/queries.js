import Route from "@ember/routing/route";

export default class DemoQueriesRoute extends Route {
  queryParams = { status: { refresh: true } };
}
