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

  // var cache = new function () {
  //   var store = {};

  //   this.read = function (ns, key) {
  //     return store[key];
  //   };

  //   this.write = function (ns, key, val) {
  //     store[key] = val;
  //   };
  // }();

  var Model = function (name, options={}) {
    this.store = { all: [], id: {} }

    var childParam = 'show_' + options.has_many;

    this.query = function (params, callback) {
      // var paramsKeys = Object.keys(params);
      // var all = (paramsKeys.length == 0
      //         || (paramsKeys.length == 1
      //         && paramsKeys.indexOf(childParam) != -1));
      // if (this.preloaded && all) {
      //   callback(cache.read(name), true);
      // } else {
        api(name, params, callback);
      // }
    };

    this.preloaded = false;

    this.preload = function (callback) {
      var params = {};
      if (options[has_many])
        params[childParam] = true;
      this.query(params, function (models, success) {
        if (success) {
          for (var m in models) {
            this.store.all = models;
            this.store.id[models[m].id] = models[m];
            if (options.has_many) {
              var children = [];
              for (var n in models[m][options.has_many]) {
                var child = models[m][options.has_many][n];
                self.models[options.has_many].store.id[child.id] = child;
                children.push(child);
              }
              self.models[options.has_many].store.all = children;
            }
          }
          this.preloaded = true;
        }
        callback(models, success);
      });
    }
  };

  var addModel = function (name) {
    return self.models[name] = new Model(name);
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
