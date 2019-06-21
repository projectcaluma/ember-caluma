import Base from "ember-caluma/lib/base";
import { computed, observer } from "@ember/object";
import { inject as service } from "@ember/service";
import { reads } from "@ember/object/computed";
import { assert } from "@ember/debug";
import { getOwner } from "@ember/application";
import { later, once } from "@ember/runloop";

/**
 * Object to represent a navigation state for a certain fieldset.
 *
 * @class NavigationItem
 */
export const NavigationItem = Base.extend({
  router: service(),

  init() {
    this._super(...arguments);

    assert("A fieldset `fieldset` must be passed", this.fieldset);
  },

  /**
   * The fieldset to build the navigation item for
   *
   * @property {Fieldset} fieldset
   */
  fieldset: null,

  label: reads("fieldset.field.question.label"),
  slug: reads("fieldset.field.question.subForm.slug"),
  parentSlug: reads("fieldset.field.fieldset.field.question.subForm.slug"),

  /**
   * The item is active if the query param `displayedForm` is equal to the
   * `slug` of the item.
   *
   * @property {Boolean} active
   */
  active: computed("router.currentRoute.queryParams.displayedForm", function() {
    return (
      this.slug === this.get("router.currentRoute.queryParams.displayedForm")
    );
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
    function() {
      return (
        !this.fieldset.field.hidden &&
        this.fieldset.fields.some(
          field => field.questionType !== "FormQuestion" && !field.hidden
        )
      );
    }
  )
});

export const NavigationTreeItem = Base.extend({
  init() {
    this._super(...arguments);

    assert("A navigation item `item` must be passed", this.item);

    this.setProperties({
      parent: null,
      children: []
    });
  },

  /**
   * The item is visible if it is navigable or at least one of its children is
   * navigable.
   *
   * @property {Boolean} visible
   */
  visible: computed("item.navigable", "children.@each.visible", function() {
    return (
      this.item.navigable || this.children.some(treeItem => treeItem.visible)
    );
  }),

  state: computed("fieldsetState", "children.@each.fieldsetState", function() {
    const states = [
      this.fieldsetState,
      ...this.children.map(childTreeItem => childTreeItem.fieldsetState)
    ].filter(Boolean);

    if (states.every(state => state === "untouched")) {
      return "untouched";
    }

    if (states.some(state => state === "invalid")) {
      return "invalid";
    }

    return states.every(state => state === "valid") ? "valid" : "unfinished";
  }),

  fieldsetState: computed(
    "item.fieldset.fields.@each.{isNew,isValid,hidden,optional}",
    function() {
      const visibleFields = this.item.fieldset.fields.filter(
        f => f.questionType !== "FormQuestion" && !f.hidden
      );

      if (!visibleFields.length) {
        return null;
      }

      if (visibleFields.every(f => f.isNew)) {
        return "untouched";
      }

      if (visibleFields.some(f => !f.isValid && !f.isNew)) {
        return "invalid";
      }

      if (
        visibleFields
          .filter(f => !f.question.optional)
          .every(f => f.isValid && !f.isNew)
      ) {
        return "valid";
      }

      return "unfinished";
    }
  )
});

/**
 * Object to represent a navigation state for a certain document.
 *
 * @class Navigation
 * @public
 */
export const Navigation = Base.extend({
  router: service(),

  init() {
    this._super(...arguments);

    assert("A document `document` must be passed", this.document);
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
   * @accessor {NavigationItem[]} items
   */
  items: computed("document.fieldsets.[]", function() {
    return this.document.fieldsets
      .filter(fieldset => fieldset.field)
      .map(fieldset =>
        NavigationItem.create(getOwner(this).ownerInjection(), { fieldset })
      );
  }),

  /**
   * The tree structured navigation items for the side navigation
   *
   * @accessor {Object} tree
   */
  tree: computed("items.@each.parentSlug", function() {
    const treeItems = this.items.map(item =>
      NavigationTreeItem.create(getOwner(this).ownerInjection(), { item })
    );

    treeItems.forEach(treeItem => {
      const parent =
        treeItems.find(({ item }) => item.slug === treeItem.item.parentSlug) ||
        null;

      if (parent) {
        treeItem.set("parent", parent);
        parent.set("children", [...parent.children, treeItem]);
      }
    });

    return { children: treeItems.filter(treeItem => !treeItem.parent) };
  }),

  /**
   * The currently active navigation item
   *
   * @accessor {NavigationItem} currentItem
   */
  currentItem: computed("items.@each.active", function() {
    return this.items.find(item => item.active);
  }),

  /**
   * The next navigable item in the navigation tree
   *
   * @accessor {NavigationItem} nextItem
   */
  nextItem: computed("currentItem", "items.@each.navigable", function() {
    if (!this.currentItem) return this.items.filter(item => item.navigable)[0];

    const items = this.items
      .slice(this.items.indexOf(this.currentItem) + 1)
      .filter(item => item.navigable);

    return items.length ? items[0] : null;
  }),

  /**
   * The previous navigable item in the navigation tree
   *
   * @accessor {NavigationItem} previousItem
   */
  previousItem: computed("currentItem", "items.@each.navigable", function() {
    if (!this.currentItem) return null;

    const items = this.items
      .slice(0, this.items.indexOf(this.currentItem))
      .filter(item => item.navigable);

    return items.length ? items[items.length - 1] : null;
  }),

  /**
   * Observer which transitions to the next navigable item if the current item
   * is not navigable.
   *
   * @method preventNonNavigableItem
   * @private
   */
  // eslint-disable-next-line ember/no-observers
  preventNonNavigableItem: observer("currentItem", function() {
    if (!this.get("nextItem.slug") || this.get("currentItem.navigable")) {
      return;
    }

    later(this, () => once(this, "goToNextItem"));
  }),

  /**
   * Replace the current item with the next navigable item
   *
   * @method goToNextItem
   * @private
   */
  goToNextItem() {
    if (!this.get("nextItem.slug") || this.get("currentItem.navigable")) {
      return;
    }

    this.router.replaceWith({
      queryParams: { displayedForm: this.nextItem.slug }
    });
  }
});

export default Navigation;
