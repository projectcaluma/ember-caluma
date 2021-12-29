import { setOwner } from "@ember/application";
import { assert } from "@ember/debug";
import { registerDestructor } from "@ember/destroyable";
import { inject as service } from "@ember/service";

import CalumaStoreService from "@projectcaluma/ember-form/services/caluma-store";

export default abstract class Base {
  @service declare calumaStore: CalumaStoreService;

  constructor({ owner }: { owner: unknown }) {
    setOwner(this, owner);

    registerDestructor(this, () => {
      if (this.pk) {
        this.calumaStore.delete(this.pk);
      }
    });
  }

  /**
   * The primary key of the object. This needs to be implemented on each class
   * extending from the base class.
   */
  get pk(): string {
    assert(`\`pk\` must be defined on \`${this.constructor.name}\``);

    return "";
  }

  /**
   * Push the object into the caluma store
   */
  pushIntoStore(): void {
    if (this.pk) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.calumaStore.push(this);
    }
  }
}
