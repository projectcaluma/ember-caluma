import slugify from "slugify";

export default function(value) {
  return slugify(value.toLowerCase(), {
    remove: /((?![a-z0-9-\s]).)/g
  }).substr(0, 50);
}
