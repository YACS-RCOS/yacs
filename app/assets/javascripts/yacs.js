Yacs = new function () {
  var self = this;

/* ======================================================================== *
    Network
 * ======================================================================== */

  var get = function (uri, callback) {
    req = new XMLHttpRequest();
    req.open("GET", uri);
    req.onreadystatechange = function () {
      if (req.readyState == 4 && callback) {
        callback(req.responseText, req.status == 200)
      }
    }
    req.send();
  };

  var api = function (model, params, callback) {
    var queryString = "?";
    for (var param in params) {
      if (params.hasOwnProperty(param)) {
        var val = Array.isArray(params[param]) ? params[param].join(',') : params[param];
        queryString += param + "=" + val + "&";
      }
    }
    get("/api/v5/" + model + ".json" + queryString, function (response, success) {
      callback(!success || JSON.parse(response)[model], success);
    });
  };

/* ======================================================================== *
    ORM
 * ======================================================================== */

  self.models = { };

  var Model = function (name, options={}) {

    this.query = function (params, callback) {
      if (options.has_many) {
        self.models[has_many]
      }
      api(name, params, callback);
    }
  };

  var addModel = function (name) {
    self.models[name] = new Model(name);
  }

  addModel('schools');
  addModel('departments')
  addModel('courses');
  addModel('sections');
  addModel('schedules');

/* ======================================================================== *
    DOM
 * ======================================================================== */

 // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
 var matches = function (elm, selector) {
    var matches = (elm.document || elm.ownerDocument).querySelectorAll(selector);
    var i = matches.length;
    while (--i >= 0 && matches.item(i) !== elm);
    return i > -1;
  }

  self.on = function (event, selector, callback) {
    document.addEventListener(event, function (e) {
      e.target = e.target || e.srcElement;
      if ((e.target.matches ? e.target.matches(selector) : matches(e.target, selector))) {
        callback(e);
        e.stopPropagation();
      }
    }, false);
  };
}();
