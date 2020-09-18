//
// xhr("/api", {
//   method: "",
//   responseType: "",
//   headers: {},
//   onload: function(req) {},
//   onerror: function(req) {},
//   json: {},
//   form: "",
//   body: "",
// })
//
export function xhr(url, options = {}) {
  const request = new XMLHttpRequest();

  request.open(options.method || "GET", url, true);

  if (options.headers) {
    for (let key in options.headers) {
      request.setRequestHeader(key, options.headers[key]);
    }
  }

  if (options.onload) {
    request.onload = function () {
      options.onload(request);
    };
  }

  if (options.onerror) {
    request.onerror = function () {
      options.onerror(request);
    };
  }

  if (options.responseType) {
    request.responseType = options.responseType;
  }

  if (options.withCredentials) {
    request.withCredentials = options.withCredentials;
  }

  if (options.json) {
    request.setRequestHeader("content-type", "application/json");
    request.send(JSON.stringify(data));
  } else if (options.form) {
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    request.send(options.form);
  } else if (options.body) {
    request.send(options.body);
  } else {
    request.send();
  }

  return request;
}
