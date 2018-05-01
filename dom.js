//
// querySelector
// querySelectorAll
//
// qs('.selector')
// qs(parentElement, '.children');
//

export function querySelector(...args) {
  const selector = args.pop();
  const scope = args.pop() || document;

  return scope.querySelector(selector);
}

export function querySelectorAll(...args) {
  const selector = args.pop();
  const scope = args.pop() || document;

  // Converts NodeList to Array
  return Array.prototype.slice.call(scope.querySelectorAll(selector));
}
