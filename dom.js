//
// Dom-ready IIFE
//
(function(doc, load) {
  doc.addEventListener(load, ready);
  function ready() {
    doc.removeEventListener(load, ready);

    // Do stuff
  }
})(document, 'DOMContentLoaded');

//
// Delegated event
//
function delegateEvent(container, event, selector, callback) {
  container.addEventListener(event, function(e) {
    var target = e.target;
    do {
      if (target.matches(selector)) {
        callback(e);
        return;
      }
    }
    while (target = target.parentNode)
  });
}

//
// Transform querySelectorAll Nodelist to Array
//
function toArray(list) {
  return Array.prototype.slice.call(list);
}

//
// Parse Query String
//
// TODO
