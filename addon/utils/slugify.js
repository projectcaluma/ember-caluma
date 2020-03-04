import slugify from "slugify";

/**
 * @see https://github.com/projectcaluma/caluma/pull/962
 */
export default function(value) {
  return slugify(value.toLowerCase(), {
    remove: /((?![a-z0-9-\s]).)/g
  }).substr(0, 127);
}
