//
// Dom-ready
//
export function domReady(onReady) {
  if (document.readyState !== "loading") {
    ready();
  } else {
    document.addEventListener("DOMContentLoaded", ready);
  }

  function ready() {
    document.removeEventListener("DOMContentLoaded", ready);
    onReady();
  }
}

//
// querySelector and querySelectorAll
//
export function qs(el, query) {
  if (!query) {
    query = el;
    el = document;
  }
  return el.querySelector(query);
}

export function qsa(el, query) {
  if (!query) {
    query = el;
    el = document;
  }
  return Array.prototype.slice.call(el.querySelectorAll(query));
}

//
// document.createElement
//
export function createEl(tag, props = {}, children = []) {
  const el = document.createElement(tag || "div");

  for (let key in props) {
    el.setAttribute(key, props[key]);
  }

  if (typeof children === "string") {
    el.textContent = children;
  } else {
    children.forEach(function (child) {
      el.appendChild(child);
    });
  }

  return el;
}
