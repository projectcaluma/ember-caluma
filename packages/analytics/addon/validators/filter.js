export default function validateFilter(/* options = {} */) {
  return (key, newValue /* oldValue, changes, content */) => {
    if (!newValue) return true;
    if (Array.isArray(newValue)) {
      // TODO: implement deep validations
      // if (newValue.length) {
      //   newValue.foreach((element) => {
      //   });
      // }
      return true;
    }
    return "Not an Array";
  };
}
