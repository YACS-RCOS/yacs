window.Yacs.user = new function () {
  var self = this;

/* ======================================================================== *
    Cookies
 * ======================================================================== */

  // http://www.w3schools.com/js/js_cookies.asp
  var setCookie = function (name, value) {
    document.cookie = name + "=" + value + "; path=/";
  }

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

  self.getSelectionsRaw = function () {
    return getCookie('selections');
  };

  // Get the selections from the cookie as an array of strings
  self.getSelections = function () {
    var selections = getCookie('selections');
    return selections ? selections.split(',') : [];
  };

  // Add a selection to those already selected. Return the success value.
  self.addSelection = function (sid) {
    arr = self.getSelections();
    if (arr.indexOf(sid) != -1) return false;
    arr.push(sid);
    setCookie('selections', arr.join(','));
    return true;
  };

  // Remove a selection from the cookie. Return the success value.
  self.removeSelection = function (sid) {
    arr = self.getSelections();
    i = arr.indexOf(sid);
    if (i === -1) return false;
    arr.splice(i, 1);
    setCookie('selections', arr.join(','));
    return true;
  };

  // Determine whether the user has already selected a given section ID
  self.hasSelection = function (sid) {
    return self.getSelections().indexOf(sid) != -1;
  };

  // Remove all selections from cookie
  self.clearSelections = function () {
    setCookie('selections', '');
  };
}();