import application from "@projectcaluma/ember-form-builder/-private/application";

export function initialize(appInstance) {
  application.instance = appInstance;
}

export default {
  initialize,
};
