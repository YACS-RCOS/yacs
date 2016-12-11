Yacs.router = new function () {
  var self = this;

  var routes = {};

  var queryToHash = function (queryString) {
    var paramsHash = {};
    queryString = queryString.replace(/^(\?|\&)+|\&+$/g, '');
    queryString.split('&').forEach(function (entry) {
      entry = entry.split('=');
      if (entry[0].length) paramsHash[entry[0]] = entry[1];
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
      if (routes[path]) routes[path](queryToHash(params));
    };
    window.addEventListener('hashchange', onChange, false);
    onChange();
  };
}();
