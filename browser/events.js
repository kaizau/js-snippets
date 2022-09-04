export function once(target, event, handler) {
  target.addEventListener(event, function handleOnce(evt) {
    target.removeEventListener(event, handleOnce);
    handler(evt);
  });
}

export function delegateOn(parent, event, targetSelector, handler) {
  parent.addEventListener(event, function (evt) {
    const delegated = evt.target.closest(targetSelector);
    if (delegated) {
      handler(evt, delegated);
    }
  });
}
