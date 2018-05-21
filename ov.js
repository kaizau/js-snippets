// Decorate an accessor function with obvservable methods
function observablify(fn) {
  fn.publish = function publish() {
    // TODO set `this` for handler
    fn.listeners.forEach(handler => handler(fn.value, fn.previousValue, fn));
  };

  fn.subscribe = function subscribe(handler) {
    fn.listeners.push(handler);
  };

  // TODO return unsubscribe function instead?
  fn.unsubscribe = function unsubscribe(handler) {
    const index = fn.listeners.indexOf(handler);
    if (index > -1) {
      fn.listeners.splice(index, 1);
    }
  };

  return fn;
}

//
// An observable value
//
// const obsValue = ov('abc');
// obsValue.subscribe(console.log);
// obsValue();        // => 'abc'
// obsValue('abc');   // => (identical value, skipped)
// obsValue('def');   // => 'def', 'abc'
//
export function ov(value) {
  function accessor(newValue) {
    if (arguments.length && newValue !== accessor.value) {
      accessor.previousValue = accessor.value;
      accessor.value = newValue;
      accessor.publish();
    }
    return accessor.value;
  }

  accessor.previousValue = null;
  accessor.value = value;
  accessor.listeners = [];

  return observablify(accessor);
}

export function oo(obj) {
  const o = ov(obj);

  // TODO handle previousValue
  o.set = function set() {
  };

  o.get = function get() {
  };

  // Maybe use this instead of a function wrapper?
  o.exec = function exec(methodName, ...args) {

  };

  return o;
}


export function oa(arr) {
  const o = ov(arr);

  // Wrap array methods

  return o;
}
