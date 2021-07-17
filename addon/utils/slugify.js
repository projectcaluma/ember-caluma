import slugify from "slugify";

/**
 * @see https://github.com/projectcaluma/caluma/pull/962
 */
export default function (value, { locale = null, namespace = "" } = {}) {
  return slugify(value, {
    lower: true,
    strict: true,
    locale,
  }).substr(0, 127 - namespace.length);
}
