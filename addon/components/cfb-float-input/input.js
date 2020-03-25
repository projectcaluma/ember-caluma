import InputComponent from "ember-validated-form/components/validated-input/types/-themes/uikit/input";

export default InputComponent.extend({
  init() {
    this._super(...arguments);

    this.set("type", "number");
  },

  attributeBindings: ["step"],
  step: "any",
});
