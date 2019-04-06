//
// Shorthand el.querySelector and el.querySelectorAll
//
function qs(el, selector) {
  if (!selector) {
    selector = el;
    el = document;
  }
  return el.querySelector(selector);
}

function qsa(el, selector) {
  if (!selector) {
    selector = el;
    el = document;
  }
  var list = el.querySelectorAll(selector);
  return Array.prototype.slice.call(list);
}

//
// Event delegation pattern
//   parentEl.addEventListener('click', function(e) {
//     if (e.target.closest('.childTarget')) {
//       ...
//     }
//   });
//
