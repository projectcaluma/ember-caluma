import { getOwner } from "@ember/application";
import Component from "@glimmer/component";

/**
 * Label component of the CfField
 *
 * @class CfFieldLabelComponent
 */
export default class CfFieldLabelComponent extends Component {
  get config() {
    return getOwner(this).resolveRegistration("config:environment");
  }

  get useMandatoryAsterisk() {
    const { USE_MANDATORY_ASTERISK = false } =
      this.config["ember-caluma"] || {};

    return [true, false].includes(this.args?.useMandatoryAsterisk)
      ? this.args?.useMandatoryAsterisk
      : USE_MANDATORY_ASTERISK;
  }
}
