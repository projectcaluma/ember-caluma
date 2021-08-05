export function navigationTitle(target, name, descriptor) {
  target.__navigationTitleProperty = name;

  return descriptor;
}

export default { navigationTitle };
