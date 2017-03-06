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

  // models defined and added in lib/model.js

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
   * Adds an event listener to the given element or list of elements.
   * @param  {String} eventType - type of event, "click" or "keydown", etc
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
