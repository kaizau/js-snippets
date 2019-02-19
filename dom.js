//
// Some copy-paste patterns for coding "without guns"
//

//
// Dom-ready IIFE
//
(function(doc, loaded) {
  doc.addEventListener(loaded, ready);
  function ready() {
    doc.removeEventListener(loaded, ready);

    // Do stuff
  }
}(document, 'DOMContentLoaded'));

//
// Delegated events
//
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector;
}
function delegatedEvent(selector, handler) {
  return function(e) {
    var target = e.target;
    while (target && target !== e.currentTarget) {
      if (target.matches(selector)) {
        handler(e);
        break;
      }
      target = target.parentNode;
    }
  }
}

//
// Transform querySelectorAll Nodelist to Array
//
function toArray(list) {
  return Array.prototype.slice.call(list);
}
