import Component from "@glimmer/component";

export default class CfFieldLabelComponent extends Component {
  get optional() {
    if (this.args.field?.question.isCalculated) {
      return false;
    }

    return this.args?.field.optional;
  }
}
