import Engine from "ember-engines/engine";
import Resolver from "ember-resolver";
import loadInitializers from "ember-load-initializers";
import config from "./config/environment";

const { modulePrefix } = config;

/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
const Eng = Engine.extend({
  modulePrefix,
  Resolver,

  dependencies: {
    services: [
      "apollo",
      "notification",
      "router",
      "intl",
      "caluma-options",
      "validator",
    ],
  },
});

loadInitializers(Eng, modulePrefix);

export default Eng;
