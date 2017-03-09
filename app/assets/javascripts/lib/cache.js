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
   * Add a new field to the cache.
   * Optionally clear previous contents if the field already exists.
   */
  self.addField = function(name, value, overwrite) {
    if (overwrite || !(name in self.tmp)) {
      self.tmp[name] = value;
    }
  };

  /**
   * Return a reference to a cache field so it can be set later.
   */
  self.getField = function(name) {
    return self.tmp[name];
  };
}();
