/**
  * @constructor Model
  * @description
  * Represents a collection of objects obtained from the YACS API
  * @param {String} name - pluralized name of collection
  * @param {Object} [options] - extra properties of the collection
  * @param {String} [options.hasMany] - name of one-to-many association
  * @memberOf Yacs
  */
'use strict';

Yacs.Model = function (name, initOptions) {
  var options = initOptions || {};
  var self = this;
  var childParam = 'show_' + options.hasMany;

  /**
    * Stores preloaded members of the collection for synchronous access
    * @type {Object}
    */
  self.store = {
    'all': [],
    'id': {}
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
  * @param {Object} [options] - extra properties of the collection. Currently only has one field, hasMany.
  * @memberOf Yacs
  */
var addModel = function (name, options) {
  Yacs.models[name] = new Yacs.Model(name, options);
};

addModel('schools', { 'hasMany': 'departments' });
addModel('departments');
addModel('courses');
addModel('schedules');
