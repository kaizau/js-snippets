//
// An observable value
//
// const obsValue = ov('old');
// obsValue.subscribe(logger);
// obsValue();        // => 'old'
// obsValue('old');   // => (identical value, skipped)
// obsValue('new');   // => 'new', 'old'
//
// Modifying arrays and objects will not publish, but replacing them will.
//
// const obsArray = ov([1, 2, 3]);
// obsArray.subscribe(logger);
// obsArray().push(4);  // => (nothing)
// obsArray([4, 5]);    // => [4, 5], [1, 2, 3]
//
// Passing a function caches the result as the value. Any extra arguments will
// be passed to the function. Any observables called within the function will
// be subscribed to, and updates to those observables will recompute the value.
//
// const foo = ov(1);
// const bar = ov(2);
// const computed = ov(arg => { a() + b() + arg }, 3);
// computed.subscribe(logger);
// computed();          // => 6
// foo(2);              // => 7, 6
//
export default function ov(value) {
  function accessor(newValue) {
    if (!arguments.length) {
      // If called inside a computed observable value function, track as a
      // child observable
      if (ov._computeActive && ov._computeChildren.indexOf(accessor) === -1) {
        ov._computeChildren.push(accessor);
      }
      return accessor.value;
    } else if (newValue !== accessor.value) {
      accessor.previousValue = accessor.value;

      if (typeof newValue !== "function") {
        accessor.value = newValue;
        accessor.publish();
      } else {
        // First argument is the value function, additional arguments are
        // passed to the value function
        const args = [];
        for (let i = 1; i < arguments.length; i++) {
          const arg = arguments[i];
          args.push(arg);
        }
        setComputedValue(accessor, newValue, args);
      }
    }
  }

  accessor.previousValue = null;
  accessor.value = value;
  accessor.subscribers = [];

  return observablify(accessor);
}

//
// Mixin for setting computed values
//
// Note, currently there's no shortcut to cleanup a computed value.
ov._computeActive = false;
ov._computeChildren = [];
function setComputedValue(fn, valueFn, args) {
  fn.compute = function compute() {
    const result = valueFn.apply(fn, args);
    if (typeof result !== "undefined") {
      if (typeof result.then === "function") {
        result.then(asyncResult => fn(asyncResult));
      } else {
        fn(result);
      }
    }
  };

  // Subscribe to child observables
  ov._computeActive = true;
  fn.compute();
  ov._computeActive = false;
  ov._computeChildren.forEach(child => child.subscribe(fn.compute));
  ov._computeChildren.length = 0;
}

//
// Mixin for observable-ish methods
//
// Pass it an accessor function with the following properties:
// - .value
// - .previousValue
// - .subscribers
//
function observablify(fn) {
  fn.publish = function publish() {
    fn.subscribers.forEach(handler => {
      if (!handler) return;
      handler.call(fn, fn.value, fn.previousValue);
    });
  };

  fn.subscribe = function subscribe(handler, immediate) {
    fn.subscribers.push(handler);
    if (immediate) {
      handler.call(fn, fn.value, fn.previousValue);
    }
  };

  fn.unsubscribe = function unsubscribe(handler) {
    const index = fn.subscribers.indexOf(handler);
    if (index > -1) {
      // Does not reindex, so that publish .forEach() continues after
      // .unsubscribe().
      delete fn.subscribers[index];
    }
  };

  return fn;
}
