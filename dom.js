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
  return Array.prototype.slice.call(el.querySelectorAll(selector));
}

//
// Event delegation pattern
//   parentEl.addEventListener('click', function(e) {
//     if (e.target.closest('.childTarget')) {
//       ...
//     }
//   });
//
