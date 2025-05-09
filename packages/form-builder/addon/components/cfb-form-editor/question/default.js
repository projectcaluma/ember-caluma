import { getOwner } from "@ember/application";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { camelize } from "@ember/string";
import Component from "@glimmer/component";

import { TYPE_MAP } from "@projectcaluma/ember-form/lib/field";

export default class CfbFormEditorQuestionDefault extends Component {
  @service router;

  get question() {
    const raw = {
      ...this.args.model.get("data"),
      ...this.args.model.get("change"),
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
        this.args.model.__typename,
      )
    ) {
      if (!this.args.disableChoicePowerselectOverride) {
        // Use Power Select for choice questions to save space.
        raw.meta = { widgetOverride: "cf-field/input/powerselect" };
      }

      const key = camelize(
        this.args.model.__typename.replace(/Question$/, "Options"),
      );

      // Format option changesets to match the raw format needed in lib.
      raw[key] = {
        edges: raw.options.map((node) => {
          return {
            node: {
              ...node.get("data"),
              ...node.get("change"),
              // While we want the real value of the option, the option should never
              // be hidden in the form-builder. We need to set a value here as no
              // value will lead to a Jexl error.
              isHidden: "false",
            },
          };
        }),
      };
      delete raw.options;
    }

    if (this.args.model.__typename === "TableQuestion") {
      raw.meta = { widgetOverride: "cfb-form-editor/question/default/table" };
    }

    return raw;
  }

  get field() {
    const rootForm = {
      slug:
        // There is no currentRoute in the integration tests.
        this.router?.currentRoute?.attributes?.formSlug || "dv-form",
      meta: {},
      questions: [this.question],
      __typename: "Form",
    };

    const typename = TYPE_MAP[this.args.model.__typename];
    const valueKey = camelize(typename.replace(/Answer$/, "Value"));

    const newAnswer = {
      id: btoa(`Answer:dv-answer-${this.args.model.slug}`),
      __typename: typename,
      [valueKey]: undefined,
    };

    // The value depends on where it comes from. If there is a default value
    // present on load the `value.content` will be set. After an update through
    // this component the value will be a POJO on `value`.
    const answer = {
      ...(this.args.value?.content ?? this.args.value ?? newAnswer),
      question: this.question,
    };

    if (answer?.tableValue?.length) {
      answer.tableValue = answer.tableValue.map((doc) => ({
        ...doc,
        form: doc.form
          ? {
              ...doc.form,
              questions: {
                edges: doc.form.questions.edges.map((edge) => ({
                  node: {
                    ...edge.node,
                    isHidden: "false",
                    isRequired: "false",
                  },
                })),
              },
            }
          : null,
      }));
    }
    const owner = getOwner(this);
    const document = new (owner.factoryFor("caluma-model:document").class)({
      raw: {
        id: btoa(`Document:dv-document-${this.args.model.slug}`),
        rootForm,
        forms: [rootForm],
        answers: [answer],
        __typename: "Document",
      },
      owner,
    });

    return document.findField(this.question.slug);
  }

  @action
  async onUpdate(value) {
    this.field.answer.value = value;

    await this.field.validate.perform();

    this.args.update({
      [this.field.answer._valueKey]: this.field.answer.serializedValue,
      __typename: this.field.answer.raw.__typename,
      id: this.field.answer.raw.id,
    });

    if (this.field.errors.length > 0) {
      // The errors must be pushed after calling update.
      this.args.model.pushErrors(this.args.name, ...this.field.errors);
    }

    this.args.setDirty();
  }
}
