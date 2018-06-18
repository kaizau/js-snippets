// Decorate an accessor function with observable methods
function observablify(fn) {
  fn.publish = function publish() {
    fn.listeners.forEach(handler => handler.call(fn, fn.value, fn.previousValue));
  };

  fn.subscribe = function subscribe(handler) {
    fn.listeners.push(handler);
  };

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

//
// An observable array
//
export function oa(arr) {
  const o = ov(arr);

  // TODO Wrap all array methods (no Proxy, for now)

  return o;
}
