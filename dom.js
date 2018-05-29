//
// querySelector('.selector')
// querySelector(parentElement, '.children');
//

export function querySelector(scope, selector) {
  if (!selector) {
    selector = scope;
    scope = document;
  }

  return scope.querySelector(selector);
}

export function querySelectorAll(scope, selector) {
  if (!selector) {
    selector = scope;
    scope = document;
  }

  // Converts NodeList to Array
  return Array.prototype.slice.call(scope.querySelectorAll(selector));
}
