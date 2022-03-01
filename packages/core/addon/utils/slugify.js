import slugify from "slugify";

/**
 * @see https://github.com/projectcaluma/caluma/pull/962
 */
export default function (value, { locale = null } = {}) {
  return slugify(value, {
    lower: true,
    strict: true,
    locale: locale?.split("-")[0].toLowerCase(),
  }).substr(0, 127);
}
