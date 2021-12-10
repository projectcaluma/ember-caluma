import { dasherize } from "@ember/string";
import Component from "@glimmer/component";

export default class IconButtonComponent extends Component {
  get class() {
    const gutters = [
      "gutter",
      "gutterTop",
      "gutterRight",
      "gutterBottom",
      "gutterLeft",
    ]
      .map((arg) =>
        this.args[arg]
          ? `uk-icon-button--${dasherize(arg)}-${this.args[arg]}`
          : null
      )
      .filter(Boolean);

    return ["uk-icon-button", ...gutters].join(" ");
  }
}
