/**
 * @namespace
 * @description
 * YACS singleton. This object is the top-level namespace for all YACS functionality.
 */
Yacs = new function () {
  var self = this;

/* ======================================================================== *
    Network
 * ======================================================================== */

  /**
   * Performs an AJAX request
   * @param  {String} uri - URI of request
   * @param  {Function} callback - callback
   * @return {undefined}
   */
  self.get = function (uri, callback) {
    req = new XMLHttpRequest();
    req.open('GET', uri);
    req.onreadystatechange = function () {
      if (req.readyState == 4 && callback) {
        callback(req.responseText, req.status == 200)
      }
    }
    req.send();
  };

  /**
   * Performs an AJAX request to the YACS API.
   * @param  {String} model - name of the route to request
   * @param  {Object} params - query parameters as a hash
   * @param  {Function} callback - callback
   * @return {undefined}
   */
  self.api = function (model, params, callback) {
    var query = "?";
    for (var param in params) {
      if (params.hasOwnProperty(param)) {
        var val = params[param];
        if (Array.isArray()) val = val.join(',')
        query += param + '=' + val + '&';
      }
    }
    var uri = '/api/v5/' + model + '.json' + query;
    self.get(uri, function (response, success) {
      callback(!success || JSON.parse(response), success);
    });
  };

/* ======================================================================== *
    ORM
 * ======================================================================== */

  self.models = { };
  /**
   * @constructor Model
   * @description
   * Represents a collection of objects obtained from the YACS API
   * @param {String} name - pluralized name of collection
   * @param {Object} [options] - extra properties of the collection
   * @param {String} [options.has_many] - name of one-to-many association
   * @memberOf Yacs
   */
  var Model = function (name, options) {
    options = options || {};
    var self = this;
    var childParam = 'show_' + options.has_many;

    /**
     * Stores preloaded members of the collection for synchronous access
     * @type {Object}
     */
    self.store = { all: [], id: {} };
    self.preloaded = false;

    /**
     * Makes request to YACS API
     * @param  {Object} params - query params as hash
     * @param  {Function} callback - callback
     * @return {undefined}
     * @memberOf Yacs.Model
     */
    self.query = function (params, callback) {
      Yacs.api(name, params, callback);
    };

    /**
     * Preloads the full collection into temporary storage to allow synchronous access
     * @param  {Function} callback - callback
     * @return {undefined}
     * @memberOf Yacs.Model
     */
    self.preload = function (callback) {
      var params = {};
      if (options.has_many)
        params[childParam] = true;
      self.query(params, function (data, success) {
        if (success) {
          var models = data[name];
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
          callback(data, success);
      });
    }
  };

  /**
   * Helper method to create and add collections to externally accessible models namespace
   * @param {String} name - pluralized name of collection
   * @param {Object} [options] - extra properties of the collection
   * @memberOf Yacs
   */
  var addModel = function (name, options) {
    return self.models[name] = new Model(name, options);
  }

  addModel('schools',     { has_many: 'departments' });
  addModel('departments', { has_many: 'courses'     });
  addModel('courses',     { has_many: 'sections'    });
  addModel('sections' );
  addModel('schedules');

/* ======================================================================== *
    DOM
 * ======================================================================== */

  /**
   * @namespace views
   * @description
   * View functions are stored within this namespace
   * @memberOf Yacs
   */
  self.views = { };

  NodeList.prototype.each = Array.prototype.forEach;
  HTMLCollection.prototype.each = Array.prototype.forEach;

 // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
  var matches = function (elm, selector) {
    var matches = (elm.document || elm.ownerDocument).querySelectorAll(selector);
    var i = matches.length;
    while (--i >= 0 && matches.item(i) !== elm);
    return i > -1;
  }

  var loaded = false;

  /**
   * Equivalent to JQuery's $(document).ready()
   * @param  {Function} func - Event handler to be called
   * @return {undefined}
   * @memberOf Yacs
   */
  self.onload = function (func) {
    document.addEventListener("DOMContentLoaded", func, false);
  }
  self.onload(function () { loaded = true; })

  /**
   * Sets the contents of the content pane
   * @param {String} html - HTML to fill the content pane
   * @return {undefined}
   * @memberOf Yacs
   */
  self.setContents = function (html) {
    document.getElementById('content').innerHTML = html;
  }
  /**
   * Clears the contents of the content pane
   * @return {undefined}
   * @memberOf Yacs
   */
  self.clearContents = function () {
    Yacs.setContents('');
  }

  /**
   * @param  {String} eventType - name of event
   * @param  {HTMLElement} elem - DOM element
   * @param  {Function} callback - callback
   * @return {undefined}
   * @memberOf Yacs
   */
  self.on = function (eventType, elem, callback) {
    elem.addEventListener(eventType, function (event) {
      callback(elem, event);
    });
  };
}();

/**
 * View for header bar. Controls site navigation and search
 * @return {undefined}
 * @memberOf Yacs.views
 */
Yacs.views.header = function () {
  var homeButton = document.getElementById('page-title');
  var searchbar = document.getElementById('searchbar');
  var scheduleButton = document.getElementById("schedule-btn");
  Yacs.on('click', homeButton, function () { Yacs.views.departments(); });
  Yacs.on('click', scheduleButton, function () {
    Yacs.models.schedules.query({ section_ids: Yacs.user.getSelectionsRaw(),
                                  show_periods: true },
      function(data, success) {
        if(success)
          Yacs.views.schedule(data);
        }
    );
  });
  Yacs.on('keydown', document, function (elem, event) {
    var key = event.keyCode;
    if (!(event.ctrlKey || event.metaKey)) {
      if (key >= 32 && key <= 127) {
        if (key == 127 && searchbar.value.length <= 1)
          Yacs.views.departments();
        searchbar.focus();
      } else if (key == 13) {
        if (searchbar.value) {
          Yacs.models.courses.query({ search: searchbar.value }, function (data, success) {
            if (success)
              Yacs.views.courses(data);
          });
        } else {
          Yacs.views.departments();
        }
      } else if ((key == 8 || key == 46) && searchbar.value.length <= 1) {
        Yacs.views.departments();
      }
    }
  });
  // Yacs.on('click', document.body, function () { searchbar.focus() });
  // TODO lol previous line was a bit of an oversight, must emulate caret
  searchbar.focus();
};

/* ======================================================================== *
    Initializers
 * ======================================================================== */

Yacs.onload(function () {
  Yacs.models.schools.preload(function (data) {
    Yacs.views.departments(data);
  });
  Yacs.views.header();
});
