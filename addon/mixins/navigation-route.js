import Mixin from "@ember/object/mixin";
import { inject as service } from "@ember/service";
import v4 from "uuid/v4";

export default Mixin.create({
  navigation: service(),
  router: service(),

  _id: null,

  activate() {
    this.set("_id", v4());

    this.get("navigation").pushEntry(this.get("_id"), {
      title: this.get("title"),
      link: [
        this.get("routeName"),
        ...Object.values(this.paramsFor(this.get("routeName")))
      ]
    });

    this.addObserver("title", this, "updateNavigationEntry");

    this._super(...arguments);
  },

  deactivate() {
    this.removeObserver("title", this, "updateNavigationEntry");
    this.get("navigation").removeEntry(this.get("_id"));
    this.set("_id", null);

    this._super(...arguments);
  },

  updateNavigationEntry(sender, key) {
    this.get("navigation").replaceEntry(this.get("_id"), {
      title: sender.get(key),
      url: this.get("routeName")
    });
  }
});
