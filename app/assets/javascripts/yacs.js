Yacs = new function () {
  var self = this;

/* ======================================================================== *
    Network
 * ======================================================================== */

  var get = function (uri, callback) {
    req = new XMLHttpRequest();
    req.open('GET', uri);
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
        queryString += param + '=' + val + '&';
      }
    }
    get('/api/v5/' + model + '.json' + queryString, function (response, success) {
      callback(!success || JSON.parse(response)[model], success);
    });
  };

/* ======================================================================== *
    ORM
 * ======================================================================== */

  self.models = { };

  var Model = function (name, options={}) {
    var self = this;
    var childParam = 'show_' + options.has_many;

    self.store = { all: [], id: {} };
    self.preloaded = false;

    self.query = function (params, callback) {
      api(name, params, callback);
    };

    self.preload = function (callback) {
      var params = {};
      if (options.has_many)
        params[childParam] = true;
      self.query(params, function (models, success) {
        if (success) {
          for (var m in models) {
            self.store.all = models;
            self.store.id[models[m].id] = models[m];
            if (options.has_many) {
              var children = [];
              for (var n in models[m][options.has_many]) {
                var child = models[m][options.has_many][n];
                Yacs.models[options.has_many].store.id[child.id] = child;
                children.push(child);
              }
              Yacs.models[options.has_many].store.all = children;
            }
          }
          preloaded = true;
        }
        if (callback)
          callback(models, success);
      });
    }
  };

  var addModel = function (name, option={}) {
    return self.models[name] = new Model(name, option);
  }

  addModel('schools',     { has_many: 'departments' });
  addModel('departments', { has_many: 'courses'     });
  addModel('courses',     { has_many: 'sections'    });
  addModel('sections' );
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
