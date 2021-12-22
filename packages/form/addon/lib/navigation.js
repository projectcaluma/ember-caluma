import { getOwner } from "@ember/application";
import { assert } from "@ember/debug";
import { associateDestroyableChild } from "@ember/destroyable";
import { later, once } from "@ember/runloop";
import { inject as service } from "@ember/service";
import { cached } from "tracked-toolbox";

import Base from "@projectcaluma/ember-form/lib/base";

const STATES = {
  EMPTY: "empty",
  IN_PROGRESS: "in-progress",
  INVALID: "invalid",
  VALID: "valid",
};

/**
 * Object to represent a navigation state for a certain fieldset.
 *
 * @class NavigationItem
 */
export class NavigationItem extends Base {
  @service router;

  constructor({ fieldset, navigation, ...args }) {
    assert("`fieldset` must be passed as an argument", fieldset);
    assert("`navigation` must be passed as an argument", navigation);

    super({ ...args });

    this.fieldset = fieldset;
    this.navigation = navigation;

    this.pushIntoStore();
  }

  /**
   * The fieldset to build the navigation item for
   *
   * @property {Fieldset} fieldset
   */
  fieldset = null;

  /**
   * The navigation object this item originates from. This is used to determine
   * the items child and parent items.
   *
   * @property {Navigation} navigation
   */
  navigation = null;

  /**
   * The primary key of the navigation item.
   *
   * @property {String} pk
   */
  @cached
  get pk() {
    return `NavigationItem:${this.fieldset.pk}`;
  }

  /**
   * The parent navigation item
   *
   * @property {NavigationItem} parent
   */
  @cached
  get parent() {
    return this.navigation.items.find((item) => item.slug === this._parentSlug);
  }

  /**
   * The children of this navigation item
   *
   * @property {NavigationItem[]} children
   */
  @cached
  get children() {
    return this.navigation.items.filter(
      (item) => item._parentSlug === this.slug
    );
  }

  /**
   * The visible children of this navigation item
   *
   * @property {NavigationItem[]} visibleChildren
   */
  @cached
  get visibleChildren() {
    return this.children.filter((child) => child.visible);
  }

  /**
   * The label displayed in the navigation
   *
   * @property {String} label
   */
  @cached
  get label() {
    return (
      this.fieldset.field?.question.raw.label ?? this.fieldset.form.raw.name
    );
  }

  /**
   * The slug of the items form
   *
   * @property {String} slug
   */
  @cached
  get slug() {
    return (
      this.fieldset.field?.question.raw.subForm.slug ?? this.fieldset.form.slug
    );
  }

  /**
   * The slug of the parent items form
   *
   * @property {String} _parentSlug
   * @private
   */
  @cached
  get _parentSlug() {
    return this.fieldset.field?.fieldset.field?.question.raw.subForm.slug;
  }

  /**
   * The item is active if the query param `displayedForm` is equal to the
   * `slug` of the item.
   *
   * @property {Boolean} active
   */
  @cached
  get active() {
    return this.slug === this.router.currentRoute?.queryParams.displayedForm;
  }

  /**
   * Whether the item has active children
   *
   * @property {Boolean} childrenActive
   */
  @cached
  get childrenActive() {
    return this.children.some((child) => child.active);
  }

  /**
   * The item is navigable if it is not hidden and its fieldset contains at
   * least one question that is not a form question and is not hidden.
   *
   * @property {Boolean} navigable
   */
  @cached
  get navigable() {
    return (
      (this.fieldset.field === undefined || !this.fieldset.field.hidden) &&
      this.fieldset.fields.some(
        (field) => field.questionType !== "FormQuestion" && !field.hidden
      )
    );
  }

  /**
   * The item is visible if it is navigable or has at least one child item.
   *
   * @property {Boolean} visible
   */
  @cached
  get visible() {
    return this.navigable || Boolean(this.visibleChildren.length);
  }

  /**
   * The current state consisting of the items and the childrens fieldset
   * state.
   *
   * This can be one of 4 states:
   * - `empty` if every fieldset is `empty`
   * - `in-progress` if there are `valid` and `empty` fieldsets
   * - `invalid` if any fieldset is `invalid`
   * - `valid` if every fieldset is `valid`
   *
   * @property {String} state
   */
  @cached
  get state() {
    const states = [
      this.fieldsetState,
      ...this.visibleChildren.map((child) => child.fieldsetState),
    ].filter(Boolean);

    if (states.every((state) => state === STATES.EMPTY)) {
      return STATES.EMPTY;
    }

    if (states.some((state) => state === STATES.INVALID)) {
      return STATES.INVALID;
    }

    return states.every((state) => state === STATES.VALID)
      ? STATES.VALID
      : STATES.IN_PROGRESS;
  }

  /**
   * The dirty state of the navigation item. This will be true if at least one
   * of the children or the navigation fieldset itself is dirty.
   *
   * @property {Boolean} fieldsetDirty
   */
  @cached
  get dirty() {
    return [
      this.fieldsetDirty,
      ...this.visibleChildren.map((child) => child.fieldsetDirty),
    ].some(Boolean);
  }

  /**
   * All visible fields (excluding form question fields) of the fieldset that
   * are visible.
   *
   * @property {Field[]} visibleFields
   */
  @cached
  get visibleFields() {
    return this.fieldset.fields.filter(
      (f) => f.questionType !== "FormQuestion" && !f.hidden
    );
  }

  /**
   * The current state of the item's fieldset. This does not consider the state
   * of children items.
   *
   * This can be one of 4 states:
   * - `empty` if every field is new
   * - `in-progress` if there are valid and new fields
   * - `invalid` if any field is invalid
   * - `valid` if every field is valid
   *
   * @property {String} fieldsetState
   */
  @cached
  get fieldsetState() {
    if (!this.visibleFields.length) {
      return null;
    }

    if (this.visibleFields.some((f) => !f.isValid && f.isDirty)) {
      return STATES.INVALID;
    }

    if (this.visibleFields.every((f) => f.isNew)) {
      return STATES.EMPTY;
    }

    if (
      this.visibleFields
        .filter((f) => !f.optional)
        .every((f) => f.isValid && !f.isNew)
    ) {
      return STATES.VALID;
    }

    return STATES.IN_PROGRESS;
  }

  /**
   * The dirty state of the current fieldset. This will be true if at least one
   * field in the fieldset is dirty.
   *
   * @property {Boolean} fieldsetDirty
   */
  @cached
  get fieldsetDirty() {
    return this.visibleFields.some((f) => f.isDirty);
  }
}

/**
 * Object to represent a navigation state for a certain document.
 *
 * @class Navigation
 */
export class Navigation extends Base {
  @service router;

  constructor({ document, ...args }) {
    assert("`document` must be passed as an argument", document);

    super({ ...args });

    this.document = document;

    this.pushIntoStore();

    this._createItems();

    this.router.on("routeDidChange", this, "goToNextItemIfNonNavigable");
  }

  /**
   * The primary key of the navigation
   *
   * @property {String} pk
   */
  @cached
  get pk() {
    return `Navigation:${this.document.pk}`;
  }

  _createItems() {
    const owner = getOwner(this);

    const items = this.document.fieldsets.map((fieldset) => {
      const pk = `NavigationItem:${fieldset.pk}`;

      return associateDestroyableChild(
        this,
        this.calumaStore.find(pk) ||
          new (owner.factoryFor("caluma-model:navigation-item").class)({
            fieldset,
            navigation: this,
            owner,
          })
      );
    });

    this.items = items;
  }

  /**
   * The document to build the navigation for
   *
   * @property {Document} document
   */
  document = null;

  /**
   * The navigation items for the given document
   *
   * @property {NavigationItem[]} items
   */
  items = [];

  /**
   * The top level navigation items. Those are items without a parent item that
   * are visible.
   *
   * @property {NavigationItem[]} rootItems
   */
  @cached
  get rootItems() {
    return this.items.filter((i) => !i.parent && i.visible);
  }

  /**
   * The currently active navigation item
   *
   * @property {NavigationItem} currentItem
   */
  get currentItem() {
    return this.items.find((item) => item.active);
  }

  /**
   * The next navigable item in the navigation tree
   *
   * @property {NavigationItem} nextItem
   */
  get nextItem() {
    if (!this.currentItem)
      return this.items.filter((item) => item.navigable)[0];

    const items = this.items
      .slice(this.items.indexOf(this.currentItem) + 1)
      .filter((item) => item.navigable);

    return items.length ? items[0] : null;
  }

  /**
   * The previous navigable item in the navigation tree
   *
   * @property {NavigationItem} previousItem
   */
  get previousItem() {
    if (!this.currentItem) return null;

    const items = this.items
      .slice(0, this.items.indexOf(this.currentItem))
      .filter((item) => item.navigable);

    return items.length ? items[items.length - 1] : null;
  }

  /**
   * Observer which transitions to the next navigable item if the current item
   * is not navigable.
   *
   * @method goToNextItemIfNonNavigable
   */
  goToNextItemIfNonNavigable() {
    if (!this.nextItem?.slug || this.currentItem?.navigable) {
      return;
    }

    later(this, () => once(this, "goToNextItem"));
  }

  /**
   * Replace the current item with the next navigable item
   *
   * @method goToNextItem
   */
  goToNextItem() {
    if (!this.nextItem?.slug || this.currentItem?.navigable) {
      return;
    }

    this.router.replaceWith({
      queryParams: { displayedForm: this.nextItem.slug },
    });
  }
}

export default Navigation;
