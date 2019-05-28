import Component from "@ember/component";
import layout from "../templates/components/cf-navigation";
import { ComponentQueryManager } from "ember-apollo-client";

export default Component.extend(ComponentQueryManager, {
  layout
});
