import { inject as service } from "@ember/service";
import AutoresizeModifier from "ember-autoresize-modifier/modifiers/autoresize";

export default class CustomAutoresizeModifier extends AutoresizeModifier {
  @service inViewport;

  didInstall() {
    super.didInstall();

    this.inViewport.watchElement(this.element).onEnter(this.resize);
  }

  willRemove() {
    this.inViewport.stopWatching(this.element);
  }
}
