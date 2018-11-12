//
// Some copy-paste patterns for coding "without guns"
//

//
// Dom-ready IIFE
//
(function(doc, load) {
  doc.addEventListener(load, ready);
  function ready() {
    doc.removeEventListener(load, ready);

    // Do stuff
  }
}(document, 'DOMContentLoaded'));

//
// Delegated events
//
export function delegateEvent(container, selector, event, callback) {
  container.addEventListener(event, function(e) {
    var target = e.target;
    var matched;

    do {
      matched = target.matches(selector);
      if (matched) {
        callback(e);
      }
    }
    while (
      !matched
      && target !== e.currentTarget
      && (target = target.parentNode)
    );
  }, true);
}

//
// Transform querySelectorAll Nodelist to Array
//
function toArray(list) {
  return Array.prototype.slice.call(list);
}

//
// Parse Query String (extracted from mithril.js)
//
function parseQueryString(string) {
  if (string === '' || string == null) return {};
  if (string.charAt(0) === '?') string = string.slice(1);
  var entries = string.split('&'),
    data0 = {},
    counters = {};
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i].split('=');
    var key5 = decodeURIComponent(entry[0]);
    var value = entry.length === 2 ? decodeURIComponent(entry[1]) : '';
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    var levels = key5.split(/\]\[?|\[/);
    var cursor = data0;
    if (key5.indexOf('[') > -1) levels.pop();
    for (var j = 0; j < levels.length; j++) {
      var level = levels[j],
        nextLevel = levels[j + 1];
      var isNumber = nextLevel == '' || !isNaN(parseInt(nextLevel, 10));
      var isValue = j === levels.length - 1;
      if (level === '') {
        var key5 = levels.slice(0, j).join();
        if (counters[key5] == null) counters[key5] = 0;
        level = counters[key5]++;
      }
      if (cursor[level] == null) {
        cursor[level] = isValue ? value : isNumber ? [] : {};
      }
      cursor = cursor[level];
    }
  }
  return data0;
}
