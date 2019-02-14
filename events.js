//
// A tiny event bus
//

export default {
  events: Object.create(null),

  on(event, handler) {
    (this.events[event] || this.events[event] = []).push(handler);
  },

  off(event, handler) {
    if (this.events[event]) {
      const index = this.events[event].indexOf(handler);
      if (index > -1) {
        this.events[event].splice(index, 1);
      }
    }
  },

  one(event, handler) {
    const oneHandler = (...args) => {
      handler(...args);
      this.off(event, oneHandler);
    };
    this.on(event, oneHandler);
  },

  emit(event, ...args) {
    if (this.events[event]) {
      // TODO set this value for handler?
      this.events[event].forEach(handler => handler(...args));
    }
  }
};
