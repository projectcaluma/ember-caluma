import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class CfFieldInpuRadio extends Component {
  isAnswerRemoved = (option) => {
    return (
      this.args.field.compare &&
      this.args.field?.answer?.historicalValue === option.slug &&
      this.args.field?.answer?.value !== option.slug
    );
  };
  isAnswerAdded = (option) => {
    return (
      this.args.field.compare &&
      this.args.field?.answer?.historicalValue !== option.slug &&
      this.args.field?.answer?.value === option.slug
    );
  };

  @action
  reset(event) {
    event.preventDefault();

    this.args.onSave(null);
  }
}
