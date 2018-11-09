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
// obsValue.subscribe(logger);
// obsValue();        // => 'abc'
// obsValue('abc');   // =>
// obsValue('def');   // => 'def', 'abc'
//
// Modifying arrays and objects will not publish, but replacing them will.
//
// const obsArray = ov([1, 2, 3]);
// obsArray.subscribe(logger);
// obsArray();          // => [1, 2, 3]
// obsArray().push(4);  // =>
// obsArray();          // => [1, 2, 3, 4]
// obsArray([4, 5]);    // => [4, 5], [1, 2, 3, 4]
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
