import DefaultTableComponent from "@projectcaluma/ember-form-builder/components/cfb-form-editor/question/default/table";

export function initialize(appInstance) {
  const options = appInstance.lookup("service:caluma-options");

  options.registerComponentOverride({
    component: "cfb-form-editor/question/default/table",
    componentClass: DefaultTableComponent,
    types: [],
  });
}

export default {
  initialize,
};
