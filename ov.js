//
// OV = Observable Value
//
// const obsValue = new OV('abc');
// obsValue.subscribe(console.log);
// obsValue('abc'); // => (identical value, skipped)
// obsValue('def'); // => 'def', 'abc'
//
// const obsArray = new OV([1, 2]);
// obsArray.subscribe(console.log);
// obsArray.mutate(v => v.push(3)); // => [1, 2, 3], [1, 2]
//
// const obsObject = new OV({a: 1, b: 2});
// obsObject.subscribe(console.log);
// obsObject.mutate(v => v.a = 4);  // => {a: 4, b: 2}, {a: 1, b: 2}
//
export function OV(value) {
  let oldValue;
  const listeners = [];

  function accessor(newValue) {
    // TODO better cloned object comparison?
    if (arguments.length && newValue !== value) {
      mutate(() => value = newValue);
    }
    return value;
  }

  function notify() {
    listeners.forEach(listener => listener(value, oldValue, accessor));
  }

  // TODO better shallow cloning?
  accessor.mutate = function mutate(fn) {
    if (Array.isArray(value)) {
      oldValue = value.slice();
    } else if (value && typeof value === 'object') {
      oldValue = Object.assign({}, value);
    } else {
      oldValue = value;
    }
    fn(value);
    notify();
  };

  accessor.subscribe = function subscribe(listener) {
    listeners.push(listener);
  };

  accessor.unsubscribe = function unsubscribe(listener) {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };

  return accessor;
}

// Helper factory for DOM modification
// obs.subscribe(bind(el, 'textContent'));
export function bind(el, prop, template) {
  return value => {
    template = template ? template.replace(/{{value}}/g, value) : value;
    // TODO browser compat?
    el.setAttribute(prop, template);
  };
}

export function limit(max, fn) {
  let runs = 0;
  const listener = (value, oldValue, accessor) => {
    runs++;
    if (runs > max) {
      accessor.unsubscribe(listener);
    } else {
      fn(value, oldValue, accessor);
    }
  };
}
