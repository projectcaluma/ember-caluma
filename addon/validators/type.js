export default function(type, value) {
  return (key, newValue, oldValue, changes, content) => {
    return (Object.assign(content, changes).__typename === type) === value;
  };
}
