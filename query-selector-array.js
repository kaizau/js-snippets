// Extended querySelectorAll for evil convenience
if (!Element.prototype.querySelectorArray) {
  Element.prototype.querySelectorArray = function elementQuerySelectorArray(selector) {
    return Array.prototype.slice.call(this.querySelectorAll(selector));
  };
}

if (!document.querySelectorArray) {
  document.querySelectorArray = function querySelectorArray(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }
}
