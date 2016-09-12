Yacs.model = new function () {
  var self = this;

  /**
   * Performs an AJAX request
   * @param  {String} uri - URI of request
   * @param  {Function} callback - callback
   * @return {undefined}
   */
  var get = function (uri, callback) {
    var req = new XMLHttpRequest();
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
  var api = function (model, params, callback) {
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
     * @param  {Function} callback - callback with data and success parameters
     * @return {undefined}
     * @memberOf Yacs.Model
     */
    self.query = function (params, callback) {
      api(name, params, callback);
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
                self[options.has_many].store.id[child.id] = child;
                children.push(child);
              }
              self[options.has_many].store.all = children;
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
  self.define = function (name, options) {
    return self[name] = new Model(name, options);
  };
}();

Yacs.model.define('schools',     { has_many: 'departments' });
Yacs.model.define('departments', { has_many: 'courses'     });
Yacs.model.define('courses',     { has_many: 'sections'    });
Yacs.model.define('schedules');
