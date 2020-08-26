import Mixin from "@ember/object/mixin";
import { inject as service } from "@ember/service";
import { v4 } from "uuid";

export default Mixin.create({
  navigation: service(),
  router: service(),

  _id: null,

  activate() {
    this.set("_id", v4());

    this.navigation.pushEntry(this._id, {
      title: this.title,
      link: [this.routeName, ...Object.values(this.paramsFor(this.routeName))],
    });

    this.addObserver("title", this, "updateNavigationEntry");

    this._super(...arguments);
  },

  deactivate() {
    this.removeObserver("title", this, "updateNavigationEntry");
    this.navigation.removeEntry(this._id);
    this.set("_id", null);

    this._super(...arguments);
  },

  updateNavigationEntry(sender, key) {
    this.navigation.replaceEntry(this._id, {
      title: sender.get(key),
      link: [this.routeName, ...Object.values(this.paramsFor(this.routeName))],
    });
  },
});
