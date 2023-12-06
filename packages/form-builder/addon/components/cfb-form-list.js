import { inject as service } from "@ember/service";
import { macroCondition, isTesting } from "@embroider/macros";
import Component from "@glimmer/component";
import { timeout, restartableTask } from "ember-concurrency";

import { useCalumaQuery } from "@projectcaluma/ember-core/caluma-query";
import { allForms } from "@projectcaluma/ember-core/caluma-query/queries";

export default class ComponentsCfbFormListComponent extends Component {
  @service intl;

  formsQuery = useCalumaQuery(this, allForms, () => ({
    options: { pageSize: 20 },
    filter: this.filter,
    order: [{ attribute: "NAME", direction: "ASC" }],
  }));

  get categories() {
    return [
      {
        value: "active",
        label: this.intl.t("caluma.form-builder.form.active"),
      },
      {
        value: "archived",
        label: this.intl.t("caluma.form-builder.form.isArchived"),
      },
      {
        value: "published",
        label: this.intl.t("caluma.form-builder.form.isPublished"),
      },
      {
        value: "unpublished",
        label: this.intl.t("caluma.form-builder.form.draft"),
      },
      { value: "all", label: this.intl.t("caluma.form-builder.form.all") },
    ];
  }

  get filter() {
    const isArchived =
      this.args.category === "active"
        ? { isArchived: false }
        : this.args.category === "archived"
          ? { isArchived: true }
          : null;

    const search = this.args.search ? { search: this.args.search } : null;

    const isPublished =
      this.args.category === "unpublished"
        ? { isPublished: false }
        : this.args.category === "published"
          ? { isPublished: true }
          : null;

    return [isArchived, isPublished, search].filter(Boolean) || null;
  }

  @restartableTask
  *search(event) {
    /* istanbul ignore next */
    if (macroCondition(isTesting())) {
      // no timeout
    } else {
      yield timeout(500);
    }

    this.args.onUpdateSearch(event.target.value);
  }
}
