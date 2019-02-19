//
// xhr('/api', {
//   method: 'POST',
//   complete: function() {}
// })
//
function xhr(url, options) {
  options = options || {};

  var request = new XMLHttpRequest();
  request.addEventListener('readystatechange', function() {
    if (request.readyState !== 4) return;
    options.complete(request);
  });

  request.open(options.method || 'GET', url, true)
  if (options.headers) {
    Object.keys(options.headers).forEach(key => {
      request.setRequestHeader(key, options.headers[key]);
    });
  }
  if (options.body) {
    request.send(JSON.stringify(data));
  } else {
    request.send();
  }
}
