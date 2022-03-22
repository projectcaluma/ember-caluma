export default function register(tpl) {
  return function decorate(target, name, descriptor) {
    if (descriptor.value.__isHandler) {
      descriptor.value.__handlerFor.push(tpl);
      return descriptor;
    }

    descriptor.writable = false;
    descriptor.enumerable = true;

    descriptor.value = {
      __isHandler: true,
      // Mocks can have multiple handlers per type.
      __handlerFor: [tpl],
      fn: descriptor.value,
    };

    return descriptor;
  };
}
