'use strict';

/**
 * @namespace
 * @description
 * YACS singleton. This object is the top-level namespace for all YACS functionality.
 */
window.Yacs = new function () {
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
    var req = new XMLHttpRequest();
    req.open('GET', uri);
    req.onreadystatechange = function () {
      if (req.readyState === 4 && callback) {
        callback(req.responseText, req.status === 200);
      }
    };
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
    var query = '?';
    for (var param in params) {
      if (params.hasOwnProperty(param)) {
        var val = params[param];
        if (Array.isArray(val)) {
          val = val.join(',');
        }
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
   * @param {String} [options.hasMany] - name of one-to-many association
   * @memberOf Yacs
   */
  var Model = function (name, initOptions) {
    var options = initOptions || {};
    var self = this;
    var childParam = 'show_' + options.hasMany;

    /**
     * Stores preloaded members of the collection for synchronous access
     * @type {Object}
     */
    self.store = {
      all: [],
      id: {}
    };
    self.preloaded = false;

    /**
     * Makes request to YACS API
     * @param  {Object} params - query params as hash
     * @param  {Function} callback - callback with data and success parameters
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
      if (options.hasMany) {
        params[childParam] = true;
      }
      self.query(params, function (data, success) {
        if (success) {
          var models = data[name];
          for (var m in models) {
            self.store.all = models;
            self.store.id[models[m].id] = models[m];
            if (options.hasMany) {
              var children = [];
              for (var n in models[m][options.hasMany]) {
                var child = models[m][options.hasMany][n];
                Yacs.models[options.hasMany].store.id[child.id] = child;
                children.push(child);
              }
              Yacs.models[options.hasMany].store.all = children;
            }
          }
          self.preloaded = true;
        }
        if (callback) {
          callback(data, success);
        }
      });
    };
  };

  /**
   * Helper method to create and add collections to externally accessible models namespace
   * @param {String} name - pluralized name of collection
   * @param {Object} [options] - extra properties of the collection
   * @memberOf Yacs
   */
  var addModel = function (name, options) {
    self.models[name] = new Model(name, options);
    return self.models[name];
  };

  addModel('schools', { hasMany: 'departments' });
  addModel('departments');
  addModel('courses');
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

  /**
   * Equivalent to JQuery's $(document).ready()
   * @param  {Function} func - Event handler to be called
   * @return {undefined}
   * @memberOf Yacs
   */
  self.onload = function (func) {
    document.addEventListener('DOMContentLoaded', func, false);
  };

  /**
   * @param  {String} eventType - name of event
   * @param  {HTMLElement} elem - DOM element or NodeList
   * @param  {Function} callback - callback
   * @return {undefined}
   * @memberOf Yacs
   */
  self.on = function (eventType, elem, callback) {
    /* elem may be a NodeList returned by querySelector, a single
     * element, or just document. If it does not have a defined length,
     * convert it to a single-element array so forEach will work on it.
     */
    var elements = elem;
    if (typeof elements.length === 'undefined') {
      elements = [elements];
    }
    elements.forEach(function (e) {
      e.addEventListener(eventType, function (event) {
        callback(e, event);
      });
    });
  };

  self.render = function (target, template, data) {
    target.innerHTML = HandlebarsTemplates[template + '/template'](data);
  };
}();

/* ======================================================================== *
    initializers
 * ======================================================================== */

Yacs.onload(function () {
  Yacs.views.root(document.getElementById('content'));
});

/* ======================================================================== *
    any other top level code
 * ======================================================================== */

/* This is a temporary fix because NodeLists do not currently support
 * forEach()/map() iteration, except in recent versions of Firefox and Chrome.
 * Remove these if it is supported in all browsers YACS supports. */
NodeList.prototype.map = Array.prototype.map;
NodeList.prototype.forEach = Array.prototype.forEach;
