import { getOwner } from "@ember/application";
import { associateDestroyableChild } from "@ember/destroyable";
import RouterService from "@ember/routing/router-service";
import { next, once } from "@ember/runloop";
import { inject as service } from "@ember/service";
import { cached } from "tracked-toolbox";

import Base from "@projectcaluma/ember-form/lib/base";
import Document from "@projectcaluma/ember-form/lib/document";
import NavigationItem from "@projectcaluma/ember-form/lib/navigation-item";

/**
 * Object to represent a navigation state for a certain document.
 */
export default class Navigation extends Base {
  @service declare router: RouterService;

  constructor({ document, owner }: { document: Document; owner: unknown }) {
    super({ owner });

    this.document = document;

    this.pushIntoStore();

    this.items = this._createItems();

    this.router.on("routeDidChange", () => this.goToNextItemIfNonNavigable());
  }

  /**
   * The primary key of the navigation
   */
  @cached
  get pk(): string {
    return `Navigation:${this.document.pk}`;
  }

  _createItems(): NavigationItem[] {
    const owner = getOwner(this);
    const klass = owner.factoryFor("caluma-model:navigation-item")
      .class as typeof NavigationItem;

    return this.document.fieldsets.map((fieldset) => {
      const existing = this.calumaStore.find(
        `NavigationItem:${fieldset.pk}`
      ) as NavigationItem | null;

      return associateDestroyableChild(
        this,
        existing ??
          new klass({
            fieldset,
            navigation: this,
            owner,
          })
      );
    });
  }

  /**
   * The document to build the navigation for
   */
  readonly document: Document;

  /**
   * The navigation items for the given document
   */
  readonly items: NavigationItem[];

  /**
   * The top level navigation items. Those are items without a parent item that
   * are visible.
   */
  @cached
  get rootItems(): NavigationItem[] {
    return this.items.filter((i) => !i.parent && i.visible);
  }

  /**
   * The currently active navigation item
   */
  get currentItem(): NavigationItem | undefined {
    return this.items.find((item) => item.active);
  }

  /**
   * The next navigable item in the navigation tree
   */
  get nextItem(): NavigationItem | null {
    if (!this.currentItem)
      return this.items.filter((item) => item.navigable)[0];

    const items = this.items
      .slice(this.items.indexOf(this.currentItem) + 1)
      .filter((item) => item.navigable);

    return items.length ? items[0] : null;
  }

  /**
   * The previous navigable item in the navigation tree
   */
  get previousItem(): NavigationItem | null {
    if (!this.currentItem) return null;

    const items = this.items
      .slice(0, this.items.indexOf(this.currentItem))
      .filter((item) => item.navigable);

    return items.length ? items[items.length - 1] : null;
  }

  /**
   * Observer which transitions to the next navigable item if the current item
   * is not navigable.
   */
  goToNextItemIfNonNavigable(): void {
    if (!this.nextItem?.slug || this.currentItem?.navigable) {
      return;
    }

    next(this, () => once(this, "goToNextItem"));
  }

  /**
   * Replace the current item with the next navigable item
   *
   * @method goToNextItem
   */
  async goToNextItem(): Promise<void> {
    if (!this.nextItem?.slug || this.currentItem?.navigable) {
      return;
    }

    await this.router.replaceWith(this.router.currentRouteName, {
      queryParams: { displayedForm: this.nextItem.slug },
    });
  }
}
