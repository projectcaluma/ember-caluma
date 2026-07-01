import Component from "@glimmer/component";

import getConfig from "@projectcaluma/ember-core/utils/get-config";

/**
 * Label component of the CfField
 *
 * @class CfFieldLabelComponent
 */
export default class CfFieldLabelComponent extends Component {
  get useMandatoryAsterisk() {
    return (
      this.args.useMandatoryAsterisk ?? getConfig(this).USE_MANDATORY_ASTERISK
    );
  }
}
