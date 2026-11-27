import Route from "@ember/routing/route";
import { scheduleOnce } from "@ember/runloop";
import { inject as service } from "@ember/service";

export default class IndexRoute extends Route {
  @service("-scheduler") scheduler;
  @service distribution;
  @service router;

  async redirectToFirstInquiry() {
    // wait for navigation request and group resolver
    await this.distribution.fetchNavigation.last;
    await this.scheduler.resolveGroup.last;

    const inquiries = this.distribution.inquiries;

    const firstInquiry = inquiries.addressed[0] ?? inquiries.controlling[0];

    if (firstInquiry) {
      return this.router.replaceWith("inquiry", {
        from: firstInquiry.controllingGroups[0],
        to: firstInquiry.addressedGroups[0],
      });
    }
  }

  afterModel() {
    scheduleOnce("afterRender", this, "redirectToFirstInquiry");
  }
}
