/**
 * @namespace Persistant user data interface
 */
window.Yacs.user = new function () {
  var self = this;

/* ======================================================================== *
    Cookies
 * ======================================================================== */

  /**
   * Sets the value of a cookie by name
   * http://www.w3schools.com/js/js_cookies.asp
   * @param {String} name of cookie
   * @param {String} value of cookie
   * @return {undefined}
   */
  var setCookie = function (name, value) {
    document.cookie = name + "=" + value + "; path=/";
  }

  /**
   * Gets the value of a cookie by name
   * http://www.w3schools.com/js/js_cookies.asp
   * @param  {String} name of cookie
   * @return {String} value of cookie
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
   * Gets the value of the selection cookie
   * @return {String} section ids as comma separated values
   */
  self.getSelectionsRaw = function () {
    return getCookie('selections');
  };

  /**
   * Gets the selections from the cookie as an array of strings
   * @return {String[]} array of section ids
   */
  self.getSelections = function () {
    var selections = getCookie('selections');
    return selections ? selections.split(',') : [];
  };

  /**
   * Add a selection to those already selected. Return the success value.
   * @param {String} the section id
   * @return {Boolean} true if the selection was added, false if it was already present
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
   * @param  {String} the section id
   * @return {Boolean} true if the selection was removed, false if it was not present
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
   * @param  {String}
   * @return {Boolean} true if the section is selected, false if it is not
   */
  self.hasSelection = function (sid) {
    return self.getSelections().indexOf(sid) != -1;
  };

  /**
   * Remove all selections from cookie
   * @return {undefined}
   */
  self.clearSelections = function () {
    setCookie('selections', '');
  };
}();
