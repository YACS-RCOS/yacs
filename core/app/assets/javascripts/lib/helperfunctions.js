/* Library for various helper functions used by YACS.
 * Any function not specific to a controller or part of a
 * larger scope (like router or observer) should go here.
 */

'use strict';

Yacs.helpers = new function () {
  var self = this;

  /* YACS compares arrays a fair amount. Since Javascript does not provide a straightforward
  * way to do that, we have to do it on our own.
  * This function is intended to compare a single flat array to another single flat array,
  * with NO objects or sub-arrays.
  */
  self.arraysEquivalent = function(array1, array2) {
    // if not arrays, return false
    if (!(array1 instanceof Array) || !(array2 instanceof Array)) {
      return false;
    }

    // if lengths aren't equal, return false
    var L = array1.length;
    if (L !== array2.length) {
      return false;
    }

    for (var i = 0; i < L; ++i) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }
    return true;
  };
}();
