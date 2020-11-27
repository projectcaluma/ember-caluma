import { getOwner } from "@ember/application";
import { assert } from "@ember/debug";
import { computed, observer, defineProperty } from "@ember/object";
import { reads } from "@ember/object/computed";
import { later, once } from "@ember/runloop";
import { inject as service } from "@ember/service";

import Base from "ember-caluma/lib/base";

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
export const NavigationItem = Base.extend({
  router: service(),

  init(...args) {
    assert("A fieldset `fieldset` must be passed", this.fieldset);
    assert("A navigation `navigation` must be passed", this.navigation);

    defineProperty(this, "pk", {
      writable: false,
      value: `NavigationItem:${this.fieldset.pk}`,
    });

    this._super(...args);
  },

  /**
   * The parent navigation item
   *
   * @property {NavigationItem} parent
   * @accessor
   */
  parent: computed("_parentSlug", "navigation.items.@each.slug", function () {
    return this.navigation.items.find((item) => item.slug === this._parentSlug);
  }),

  /**
   * The children of this navigation item
   *
   * @property {NavigationItem[]} children
   * @accessor
   */
  children: computed("slug", "navigation.items.@each._parentSlug", function () {
    return this.navigation.items.filter(
      (item) => item._parentSlug === this.slug
    );
  }),

  /**
   * The visible children of this navigation item
   *
   * @property {NavigationItem[]} visibleChildren
   * @accessor
   */
  visibleChildren: computed("children.@each.visible", function () {
    return this.children.filter((child) => child.visible);
  }),

  /**
   * The fieldset to build the navigation item for
   *
   * @property {Fieldset} fieldset
   */
  fieldset: null,

  /**
   * The label displayed in the navigation
   *
   * @property {String} label
   * @accessor
   */
  label: computed.or("fieldset.field.question.label", "fieldset.form.name"),

  /**
   * The slug of the items form
   *
   * @property {String} slug
   * @accessor
   */
  slug: computed.or(
    "fieldset.field.question.subForm.slug",
    "fieldset.form.slug"
  ),

  /**
   * The slug of the parent items form
   *
   * @property {String} _parentSlug
   * @accessor
   * @private
   */
  _parentSlug: reads("fieldset.field.fieldset.field.question.subForm.slug"),

  /**
   * The item is active if the query param `displayedForm` is equal to the
   * `slug` of the item.
   *
   * @property {Boolean} active
   */
  active: computed(
    "router.currentRoute.queryParams.displayedForm",
    "slug",
    function () {
      return (
        this.slug === this.get("router.currentRoute.queryParams.displayedForm")
      );
    }
  ),

  /**
   * Whether the item has active children
   *
   * @property {Boolean} childrenActive
   */
  childrenActive: computed("children.@each.active", function () {
    return this.children.some((child) => child.active);
  }),

  /**
   * The item is navigable if it is not hidden and its fieldset contains at
   * least one question that is not a form question and is not hidden.
   *
   * @property {Boolean} navigable
   */
  navigable: computed(
    "fieldset.field.hidden",
    "fieldset.fields.@each.{hidden,questionType}",
    function () {
      return (
        (this.fieldset.field === undefined || !this.fieldset.field.hidden) &&
        this.fieldset.fields.some(
          (field) => field.questionType !== "FormQuestion" && !field.hidden
        )
      );
    }
  ),

  /**
   * The item is visible if it is navigable or has at least one child item.
   *
   * @property {Boolean} visible
   */
  visible: computed("navigable", "visibleChildren.length", function () {
    return this.navigable || Boolean(this.visibleChildren.length);
  }),

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
   * @accessor
   */
  state: computed(
    "fieldsetState",
    "visibleChildren.@each.fieldsetState",
    function () {
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
  ),

  /**
   * The dirty state of the navigation item. This will be true if at least one
   * of the children or the navigation fieldset itself is dirty.
   *
   * @property {Boolean} fieldsetDirty
   * @accessor
   */
  dirty: computed(
    "fieldsetDirty",
    "visibleChildren.@each.fieldsetDirty",
    function () {
      return [
        this.fieldsetDirty,
        ...this.visibleChildren.map((child) => child.fieldsetDirty),
      ].some(Boolean);
    }
  ),

  /**
   * All visible fields (excluding form question fields) of the fieldset that
   * are visible.
   *
   * @property {Field[]} visibleFields
   * @accessor
   */
  visibleFields: computed(
    "fieldset.fields.@each.{questionType,hidden}",
    function () {
      return this.fieldset.fields.filter(
        (f) => f.questionType !== "FormQuestion" && !f.hidden
      );
    }
  ),

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
   * @accessor
   */
  fieldsetState: computed(
    "visibleFields.@each.{isNew,isValid,optional}",
    function () {
      if (!this.visibleFields.length) {
        return null;
      }

      if (this.visibleFields.every((f) => f.isNew)) {
        return STATES.EMPTY;
      }

      if (this.visibleFields.some((f) => !f.isValid && !f.isNew)) {
        return STATES.INVALID;
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
  ),

  /**
   * The dirty state of the current fieldset. This will be true if at least one
   * field in the fieldset is dirty.
   *
   * @property {Boolean} fieldsetDirty
   * @accessor
   */
  fieldsetDirty: computed("visibleFields.@each.isDirty", function () {
    return this.visibleFields.some((f) => f.isDirty);
  }),
});

/**
 * Object to represent a navigation state for a certain document.
 *
 * @class Navigation
 */
export const Navigation = Base.extend({
  router: service(),
  calumaStore: service(),

  init(...args) {
    assert("A document `document` must be passed", this.document);

    defineProperty(this, "pk", {
      writable: false,
      value: `Navigation:${this.document.pk}`,
    });

    this._super(...args);

    this.set("items", []);

    this._createItems();
  },

  willDestroy(...args) {
    this._super(...args);

    const items = this.items;
    this.set("items", []);
    items.forEach((item) => item.destroy());
  },

  _createItems() {
    const items = this.document.fieldsets.map((fieldset) => {
      const pk = `NavigationItem:${fieldset.pk}`;

      return (
        this.calumaStore.find(pk) ||
        getOwner(this)
          .factoryFor("caluma-model:navigation-item")
          .create({ fieldset, navigation: this })
      );
    });

    this.set("items", items);
  },

  /**
   * The document to build the navigation for
   *
   * @property {Document} document
   */
  document: null,

  /**
   * The navigation items for the given document
   *
   * @property {NavigationItem[]} items
   * @accessor
   */
  items: null,

  /**
   * The top level navigation items. Those are items without a parent item that
   * are visible.
   *
   * @property {NavigationItem[]} rootItems
   * @accessor
   */
  rootItems: computed("items.@each.{parent,visible}", function () {
    return this.items.filter((i) => !i.parent && i.visible);
  }),

  /**
   * The currently active navigation item
   *
   * @property {NavigationItem} currentItem
   * @accessor
   */
  currentItem: computed("items.@each.active", function () {
    return this.items.find((item) => item.active);
  }),

  /**
   * The next navigable item in the navigation tree
   *
   * @property {NavigationItem} nextItem
   * @accessor
   */
  nextItem: computed("currentItem", "items.@each.navigable", function () {
    if (!this.currentItem)
      return this.items.filter((item) => item.navigable)[0];

    const items = this.items
      .slice(this.items.indexOf(this.currentItem) + 1)
      .filter((item) => item.navigable);

    return items.length ? items[0] : null;
  }),

  /**
   * The previous navigable item in the navigation tree
   *
   * @property {NavigationItem} previousItem
   * @accessor
   */
  previousItem: computed("currentItem", "items.@each.navigable", function () {
    if (!this.currentItem) return null;

    const items = this.items
      .slice(0, this.items.indexOf(this.currentItem))
      .filter((item) => item.navigable);

    return items.length ? items[items.length - 1] : null;
  }),

  /**
   * Observer which transitions to the next navigable item if the current item
   * is not navigable.
   *
   * @method preventNonNavigableItem
   */
  preventNonNavigableItem: observer("currentItem", function () {
    if (!this.get("nextItem.slug") || this.get("currentItem.navigable")) {
      return;
    }

    later(this, () => once(this, "goToNextItem"));
  }),

  /**
   * Replace the current item with the next navigable item
   *
   * @method goToNextItem
   */
  goToNextItem() {
    if (!this.get("nextItem.slug") || this.get("currentItem.navigable")) {
      return;
    }

    this.router.replaceWith({
      queryParams: { displayedForm: this.nextItem.slug },
    });
  },
});

export default Navigation;
