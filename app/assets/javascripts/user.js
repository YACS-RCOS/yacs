/**
 * @namespace user
 * @description Persistent storage for data relevant to the user
 * @memberOf Yacs
 */
window.Yacs.user = new function () {
  var self = this;

/* ======================================================================== *
    Cookies
 * ======================================================================== */

  /**
   * Sets the value of a cookie by name
   * http://www.w3schools.com/js/js_cookies.asp
   * @param {String} name - name of cookie
   * @param {String} value - value of cookie
   * @return {undefined}
   * @memberOf Yacs.user
   */
  var setCookie = function (name, value) {
    document.cookie = name + "=" + value + "; path=/";
  }

  /**
   * Gets the value of a cookie by name
   * http://www.w3schools.com/js/js_cookies.asp
   * @param  {String} name - name of cookie
   * @return {String} value of cookie
   * @memberOf Yacs.user
   */
  var getCookie = function (name) {
    name += "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return null;
  }

/* ======================================================================== *
    Selections
 * ======================================================================== */

  /**
   * @description
   * Gets the value of the selection cookie
   * @return {String} section ids as comma separated values
   * @memberOf Yacs.user
   */
  self.getSelectionsRaw = function () {
    return getCookie('selections');
  };

  /**
   * Gets the selections from the cookie as an array of strings
   * @return {String[]} array of section ids
   * @memberOf Yacs.user
   */
  self.getSelections = function () {
    var selections = getCookie('selections');
    return selections ? selections.split(',') : [];
  };

  /**
   * Add a selection to those already selected. Return the success value.
   * @param {String} sid - the section id
   * @return {Boolean} true if the selection was added, false if it was already present
   * @memberOf Yacs.user
   */
  self.addSelection = function (sid) {
    arr = self.getSelections();
    if (arr.indexOf(sid) != -1) return false;
    arr.push(sid);
    setCookie('selections', arr.join(','));
    return true;
  };

  /**
   * Remove a selection from the cookie. Return the success value.
   * @param  {String} sid - the section id
   * @return {Boolean} true if the selection was removed, false if it was not present
   * @memberOf Yacs.user
   */
  self.removeSelection = function (sid) {
    arr = self.getSelections();
    i = arr.indexOf(sid);
    if (i === -1) return false;
    arr.splice(i, 1);
    setCookie('selections', arr.join(','));
    return true;
  };

  /**
   * Determine whether the user has already selected a given section ID
   * @param  {String} sid - the section id
   * @return {Boolean} true if the section is selected, false if it is not
   * @memberOf Yacs.user
   */
  self.hasSelection = function (sid) {
    return self.getSelections().indexOf(sid) != -1;
  };

  /**
   * Determine whether the user has already selected a given set section IDs
   * @param  {String[]} sids - the section ids
   * @return {Boolean} true if all of the sections are selected, false if any one is not
   * @memberOf Yacs.user
   */
  self.hasAllSelections = function (sids) {
    var selections = self.getSelections();
    sids.forEach(function (sid) {
      if (selections.indexOf(sid == -1)) return false;
    });
    return true;
  };

  /**
   * Remove all selections from cookie
   * @return {undefined}
   * @memberOf Yacs.user
   */
  self.clearSelections = function () {
    setCookie('selections', '');
  };
}();
