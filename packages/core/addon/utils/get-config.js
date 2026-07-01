import { getOwner } from "@ember/application";
import { getEngineParent } from "@ember/engine";

const DEFAULTS = {
  floatStep: 0.001,
  powerSelectEnableSearchLimit: 10,
  USE_MANDATORY_ASTERISK: false,
  FLATPICKR_DATE_FORMAT: {
    de: "d.m.Y",
    fr: "d.m.Y",
    en: "m/d/Y",
  },
  FLATPICKR_DATE_FORMAT_DEFAULT: "m/d/Y",
};

/**
 * Resolve the host application's `ember-caluma` configuration, merged with the
 * addon defaults.
 *
 * Ember engines have their own, isolated `config:environment`. Resolving config
 * off an engine's own owner (e.g. via `getOwner(this)`) therefore yields the
 * engine's config instead of the host application's, which means addon
 * components rendered inside an engine silently fall back to defaults.
 *
 * When rendered inside an engine we resolve the config from the engine's parent
 * (the host application), otherwise we use the owner directly.
 *
 * @function getConfig
 * @param {Object} context Any object with an owner (e.g. a component).
 * @return {Object} The resolved `ember-caluma` config, with defaults applied.
 */
export default function getConfig(context) {
  const owner = getOwner(context);
  const host = getEngineParent(owner) ?? owner;

  return {
    ...DEFAULTS,
    ...(host.resolveRegistration("config:environment")["ember-caluma"] ?? {}),
  };
}
