export default {
  set(key, value) {
    const str = JSON.stringify(value);
    localStorage.setItem(key, str);
  },

  get(key, defaultValue) {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;

    try {
      return JSON.parse(value);
    } catch(e) {
      return value;
    }
  }
}
