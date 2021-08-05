import InputComponent from "ember-validated-form/components/validated-input/types/-themes/uikit/input";

export default InputComponent.extend({
  init(...args) {
    this._super(...args);

    this.set("type", "number");
  },

  attributeBindings: ["step"],
  step: "any",
});
