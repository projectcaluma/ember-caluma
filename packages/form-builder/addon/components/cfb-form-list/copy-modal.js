import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { Changeset } from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import { dropTask } from "ember-concurrency";

import copyFormMutation from "@projectcaluma/ember-form-builder/gql/mutations/copy-form.graphql";
import validations from "@projectcaluma/ember-form-builder/validations/form";

export default class componentsCfbFormItemListCopyModal extends Component {
  @queryManager apollo;
  @service notification;
  @service router;
  @service intl;
  @tracked visible = false;

  constructor(owner, args) {
    super(owner, args);
    this.changeset = Changeset(
      this.args.item,
      lookupValidator(validations),
      validations,
    );
  }

  @action
  toggle() {
    this.visible = !this.visible;
  }

  @dropTask
  *submit(changeset) {
    try {
      const form = yield this.apollo.mutate(
        {
          mutation: copyFormMutation,
          variables: {
            input: {
              source: this.args.item.slug,
              name: changeset.name,
              slug: changeset.slug,
            },
          },
        },
        "copyForm.form",
      );

      this.notification.success(
        this.intl.t(
          `caluma.form-builder.notification.form.${
            this.args.slug ? "save" : "create"
          }.success`,
        ),
      );

      this.router.transitionTo("edit", form.slug);
    } catch (e) {
      this.notification.danger(
        this.intl.t(
          `caluma.form-builder.notification.form.${
            this.args.slug ? "save" : "create"
          }.error`,
        ),
      );
    }
  }
}
