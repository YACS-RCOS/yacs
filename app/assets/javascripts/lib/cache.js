/**
 * @namespace cache
 * @description Temporary storage for various frontend data that cannot be held elsewhere
 * @memberOf Yacs
 */
'use strict';

window.Yacs.cache = new function() {
  var self = this;

  /* ==================================================================================
   * Define important permanent Yacs fixtures (like conflicts) in this object itself.
   * ================================================================================== */

  // Conflicts cache is an object that maps section ids to arrays of conflicting section ids.
  self.conflicts = {};

  /* ==================================================================================
   * General cache for less solid data.
   * ================================================================================== */

  // General cache for less solid data.
  self.tmp = {};

  /**
   * Add a new key-value pair to the cache.
   * Optionally clear previous contents if the field already exists.
   * @param {String} name - The identifier for this cache field.
   * @param {String} value - The new value to store in the cache field.
   * @param {boolean=} overwrite - Whether to overwrite if the identifier is already in the cache.
   */
  self.insert = function(name, value, overwrite) {
    if (overwrite || !(name in self.tmp)) {
      self.tmp[name] = value;
    }
  };

  /**
   * Retrieve data from the cache.
   * @param {String} name - The identifier for the cache field.
   * @return {Anything} The data in the cache field.
   */
  self.get = function(name) {
    return self.tmp[name];
  };
}();
