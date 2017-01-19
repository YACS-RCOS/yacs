'use strict';

Yacs.router = new function () {
  var self = this;

  var routes = {};

  var queryToHash = function (queryString) {
    var paramsHash = {};
    var newString = queryString.replace(/^(\?|&)+|&+$/g, '');
    newString.split('&').forEach(function (entry) {
      var param = entry.split('=');
      if (param[0].length > 0) {
        paramsHash[param[0]] = param[1];
      }
    });
    return paramsHash;
  };

  self.define = function (path, callback) {
    routes[path] = callback;
  };

  self.visit = function (path) {
    window.location.hash = path;
  };

  self.listen = function () {
    var onChange = function () {
      var resource = window.location.hash.slice(1).split('?');
      var path = resource[0].length ? resource[0] : '/';
      var params = resource[1] || '';
      if (routes[path]) {
        routes[path](queryToHash(params));
      }

      // handle case i.e. /schedules/ when only /schedules is defined
      else if (path.slice(-1) === '/' && routes[path.slice(0, -1)]) {
        routes[path.slice(0, -1)](queryToHash(params));
      }
    };
    window.addEventListener('hashchange', onChange, false);
    onChange();
  };
}();
