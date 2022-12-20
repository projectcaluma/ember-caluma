import { registerDestructor } from "@ember/destroyable";
import { inject as service } from "@ember/service";
import AutoresizeModifier from "ember-autoresize-modifier/modifiers/autoresize";

export default class CustomAutoresizeModifier extends AutoresizeModifier {
  @service inViewport;

  modify(...args) {
    super.modify(...args);

    this.inViewport.watchElement(this.el).onEnter(this.resize);
    registerDestructor(this, () => this.inViewport.stopWatching(this.el));
  }
}
