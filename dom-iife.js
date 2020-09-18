//
// Dom-ready IIFE
//
(function (doc, loaded) {
  if (doc.readyState !== "loading") {
    ready();
  } else {
    doc.addEventListener(loaded, ready);
  }

  function ready() {
    doc.removeEventListener(loaded, ready);

    // Do stuff
  }
})(document, "DOMContentLoaded");
