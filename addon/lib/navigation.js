import { getOwner } from "@ember/application";
import { assert } from "@ember/debug";
import { computed, observer, defineProperty } from "@ember/object";
import { reads } from "@ember/object/computed";
import { later, once } from "@ember/runloop";
import { inject as service } from "@ember/service";

import Base from "ember-caluma/lib/base";

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
   * The item is visible if it is navigable or at least one of its children is
   * navigable.
   *
   * @property {Boolean} visible
   */
  visible: computed("navigable", "children.@each.visible", function () {
    return this.navigable || this.children.some((item) => item.visible);
  }),

  /**
   * The current state consisting of the items and the childrens fieldset
   * state.
   *
   * This can be one of 4 states:
   * - `untouched` if every fieldset is `untouched`
   * - `invalid` if any fieldset is `invalid`
   * - `valid` if every fieldset is `valid`
   * - `unfinished` if there are `valid` and `untouched` fieldsets
   *
   * @property {String} state
   * @accessor
   */
  state: computed("fieldsetState", "children.@each.fieldsetState", function () {
    const states = [
      this.fieldsetState,
      ...this.children
        .filter((i) => i.visible)
        .map((childItem) => childItem.fieldsetState),
    ].filter(Boolean);

    if (states.every((state) => state === "untouched")) {
      return "untouched";
    }

    if (states.some((state) => state === "invalid")) {
      return "invalid";
    }

    return states.every((state) => state === "valid") ? "valid" : "unfinished";
  }),

  /**
   * The current state of the item's fieldset. This does not consider the state
   * of children items.
   *
   * This can be one of 4 states:
   * - `untouched` if every field is new
   * - `invalid` if any field is invalid
   * - `valid` if every field is valid
   * - `unfinished` if there are valid and new fields
   *
   * @property {String} fieldsetState
   * @accessor
   */
  fieldsetState: computed(
    "fieldset.fields.@each.{isNew,isValid,hidden,optional}",
    function () {
      const visibleFields = this.fieldset.fields.filter(
        (f) => f.questionType !== "FormQuestion" && !f.hidden
      );

      if (!visibleFields.length) {
        return null;
      }

      if (visibleFields.every((f) => f.isNew)) {
        return "untouched";
      }

      if (visibleFields.some((f) => !f.isValid && !f.isNew)) {
        return "invalid";
      }

      if (
        visibleFields
          .filter((f) => !f.optional)
          .every((f) => f.isValid && !f.isNew)
      ) {
        return "valid";
      }

      return "unfinished";
    }
  ),
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
