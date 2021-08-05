export default function (type, value) {
  return (key, newValue, oldValue, changes, content) => {
    const { __typename } = { ...changes, ...content };

    return (__typename === type) === value;
  };
}
