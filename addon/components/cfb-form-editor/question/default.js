import { getOwner } from "@ember/application";
// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { action, computed, get, set } from "@ember/object";
import { inject as service } from "@ember/service";
import RenderComponent from "ember-validated-form/components/validated-input/-themes/uikit/render";

import { TYPE_MAP } from "ember-caluma/lib/field";
import layout from "ember-caluma/templates/components/cfb-form-editor/question/default";

export default class CfbFormEditorQuestionDefault extends RenderComponent {
  layout = layout;

  @service router;

  @computed("model.{id,__typename}")
  get question() {
    const raw = {
      ...this.model.get("data"),
      ...this.model.get("change"),
      // While we want the real value, typename, etc. of the question,
      // the question should never be required or hidden in the form-builder.
      // We need to set a value here as no value will lead to a Jexl error.
      isRequired: "false",
      isHidden: "false",
    };

    // Widget overrides from the questions should not be considered for this
    // component. We manually set an override for choices but otherwise, we
    // use the real input type.
    raw.meta = {
      ...(raw.meta || {}),
      widgetOverride: undefined,
    };

    if (
      ["ChoiceQuestion", "MultipleChoiceQuestion"].includes(
        this.model.__typename
      )
    ) {
      // Use Power Select for choice questions to save space.
      raw.meta = { widgetOverride: "cf-field/input/powerselect" };

      const key = this.model.__typename
        .replace(/^./, (match) => match.toLowerCase())
        .replace("Question", "Options");

      raw[key] = raw.options;
      delete raw.options;
    }

    return raw;
  }

  // This @computed decorator is important. Otherwise, Ember will - under some
  // circumstances - enter the getter method multiple times and throw an error.
  @computed(
    "model.{__typename,slug}",
    "question",
    "question.slug",
    "router.currentRoute.attributes.formSlug",
    "value.content"
  )
  get field() {
    const rootForm = {
      slug:
        // There is no currentRoute in the integration tests.
        get(this, "router.currentRoute.attributes.formSlug") || "dv-form",
      meta: {},
      questions: [this.question],
      __typename: "Form",
    };

    // The value depends on where it comes from. If there is a default value
    // present on load the `value.content` will be set. After an update through
    // this component the value will be a POJO on `value`.
    const answer = (this.value && this.value.content) ||
      this.value || {
        id: btoa(`Answer:dv-answer-${this.model.slug}`),
        __typename: TYPE_MAP[this.model.__typename],
      };

    answer.question = this.question;

    const document = getOwner(this)
      .factoryFor("caluma-model:document")
      .create({
        raw: {
          id: btoa(`Document:dv-document-${this.model.slug}`),
          rootForm,
          forms: [rootForm],
          answers: [answer],
          __typename: "Document",
        },
      });

    return document.findField(this.question.slug);
  }

  @action async onUpdate(value) {
    set(this, "field.answer.value", value);

    await this.field.validate.perform();

    this.update({
      [this.field.answer._valueKey]: this.field.answer.serializedValue,
      __typename: this.field.answer.__typename,
      id: this.field.answer.id,
    });

    if (this.field.errors.length > 0) {
      // The errors must be pushed after calling update.
      this.model.pushErrors(this.name, ...this.field.errors);
    }

    this.setDirty();
  }
}
