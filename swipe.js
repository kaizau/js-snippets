export function handleSwipe(el, handlers, options = {}) {
  options.distanceMin = options.distanceMin || 50;
  options.durationMin = options.durationMin || 100;
  options.durationMax = options.durationMax || 1000;

  el.addEventListener("touchstart", handleStart, { passive: true });
  el.addEventListener("touchend", handleEnd);

  let initialTime = null;
  let initialX = null;
  let initialY = null;

  function handleStart(e) {
    initialTime = Date.now();
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
  }

  function handleEnd(e) {
    const diffX = initialX - e.changedTouches[0].clientX;
    const diffY = initialY - e.changedTouches[0].clientY;
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);
    const elapsed = Date.now() - initialTime;
    const passedThreshold =
      options.durationMin > elapsed || elapsed > options.durationMax;
    initialTime = initialX = initialY = null;

    let direction;
    let distance;
    if (passedThreshold || Math.max(absX, absY) < options.distanceMin) {
      return;
    } else if (absX > absY) {
      direction = diffX > 0 ? "left" : "right";
      distance = absX;
    } else {
      direction = diffY > 0 ? "up" : "down";
      distance = absY;
    }

    if (typeof handlers[direction] === "function") {
      handlers[direction](e, distance);
    } else if (typeof handlers === "function") {
      handlers(e, direction, distance);
    }
  }

  return {
    destroy: function() {
      el.removeEventListener("touchstart", handleStart, { passive: true });
      el.removeEventListener("touchend", handleEnd);
    }
  };
}
