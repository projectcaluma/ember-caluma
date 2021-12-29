import RouterService from "@ember/routing/router-service";
import { inject as service } from "@ember/service";
import { cached } from "tracked-toolbox";

import Base from "@projectcaluma/ember-form/lib/base";
import Field from "@projectcaluma/ember-form/lib/field";
import Fieldset from "@projectcaluma/ember-form/lib/fieldset";
import Navigation from "@projectcaluma/ember-form/lib/navigation";

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
export default class NavigationItem extends Base {
  @service declare router: RouterService;

  constructor({
    fieldset,
    navigation,
    owner,
  }: {
    fieldset: Fieldset;
    navigation: Navigation;
    owner: unknown;
  }) {
    super({ owner });

    this.fieldset = fieldset;
    this.navigation = navigation;

    this.pushIntoStore();
  }

  /**
   * The fieldset to build the navigation item for
   */
  readonly fieldset: Fieldset;

  /**
   * The navigation object this item originates from. This is used to determine
   * the items child and parent items.
   */
  readonly navigation: Navigation;

  /**
   * The primary key of the navigation item.
   */
  @cached
  get pk(): string {
    return `NavigationItem:${this.fieldset.pk}`;
  }

  /**
   * The parent navigation item
   */
  @cached
  get parent(): NavigationItem | undefined {
    return this.navigation.items.find((item) => item.slug === this._parentSlug);
  }

  /**
   * The children of this navigation item
   */
  @cached
  get children(): NavigationItem[] {
    return this.navigation.items.filter(
      (item) => item._parentSlug === this.slug
    );
  }

  /**
   * The visible children of this navigation item
   */
  @cached
  get visibleChildren(): NavigationItem[] {
    return this.children.filter((child) => child.visible);
  }

  /**
   * The label displayed in the navigation
   */
  @cached
  get label(): string {
    return (
      this.fieldset.field?.question.raw.label || this.fieldset.form.raw.name
    );
  }

  /**
   * The slug of the items form
   */
  @cached
  get slug(): string {
    return (
      this.fieldset.field?.question.raw.subForm?.slug ?? this.fieldset.form.slug
    );
  }

  /**
   * The slug of the parent items form
   *
   * @private
   */
  @cached
  get _parentSlug(): string | undefined {
    return this.fieldset.field?.fieldset.field?.question.raw.subForm?.slug;
  }

  /**
   * The item is active if the query param `displayedForm` is equal to the
   * `slug` of the item.
   */
  @cached
  get active(): boolean {
    return this.slug === this.router.currentRoute?.queryParams.displayedForm;
  }

  /**
   * Whether the item has active children
   */
  @cached
  get childrenActive(): boolean {
    return this.children.some((child) => child.active);
  }

  /**
   * The item is navigable if it is not hidden and its fieldset contains at
   * least one question that is not a form question and is not hidden.
   */
  @cached
  get navigable(): boolean {
    return (
      (this.fieldset.field === undefined || !this.fieldset.field.hidden) &&
      this.fieldset.fields.some(
        (field) => field.questionType !== "FormQuestion" && !field.hidden
      )
    );
  }

  /**
   * The item is visible if it is navigable or has at least one child item.
   */
  @cached
  get visible(): boolean {
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
   */
  @cached
  get state(): string {
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
   */
  @cached
  get dirty(): boolean {
    return [
      this.fieldsetDirty,
      ...this.visibleChildren.map((child) => child.fieldsetDirty),
    ].some(Boolean);
  }

  /**
   * All visible fields (excluding form question fields) of the fieldset that
   * are visible.
   */
  @cached
  get visibleFields(): Field[] {
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
   */
  @cached
  get fieldsetState(): string | null {
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
   */
  @cached
  get fieldsetDirty(): boolean {
    return this.visibleFields.some((f) => f.isDirty);
  }
}
