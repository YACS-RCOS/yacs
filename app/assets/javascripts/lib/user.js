/**
 * @namespace user
 * @description Persistent storage for data relevant to the user
 * @memberOf Yacs
 */
'use strict';

Yacs.user = new function () {
  var self = this;

/* ======================================================================== *
    Cookies
 * ======================================================================== */

  /**
   * Sets the value of a cookie by name
   * http://www.w3schools.com/js/js_cookies.asp
   * @param {String} name - name of cookie
   * @param {String} value - value of cookie
   * @memberOf Yacs.user
   */
  var setCookie = function (name, value) {
    document.cookie = name + '=' + value + '; path=/';
  };

  /**
   * Gets the value of a cookie by name
   * http://www.w3schools.com/js/js_cookies.asp
   * @param {String} name - name of cookie
   * @return {String} value of cookie
   * @memberOf Yacs.user
   */
  var getCookie = function (name) {
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(name + '=') === 0) {
        return c.substring(name.length + 1, c.length);
      }
    }
    return null;
  };

/* ======================================================================== *
    Selections
 * ======================================================================== */

  var observable = new Yacs.Observable('selection');

  /**
   * Gets the raw value of the selection cookie, with no processing.
   * @return {String} section ids as comma separated values
   * @memberOf Yacs.user
   */
  self.getSelections = function () {
    var selections = getCookie('selections');
    return selections ? JSON.parse(selections) : {};
  };

  /**
   * Gets the selections and flattens the object into an array of ints.
   * @return {Int[]} array of section ids
   * @memberOf Yacs.user
   */
  self.getSelectionsAsArray = function() {
    var selections = self.getSelections();
    output = [];
    for(var courseId in selections) {
      output = output.concat(selections[courseId]);
    }
    return output;
  };

  /**
   * Gets the number of currently selected sections.
   * @return {Int} number of selected sections
   * @memberOf Yacs.user
   */
  self.getTotalSelections = function() {
    var selections = self.getSelections();
    var total = 0;
    for(var courseId in selections) {
      total += selections[courseId].length;
    }
    return total;
  };

  /**
   * Set the cookie with the selections object.
   * @param {Object} selections - map of course ids to arrays of selected section ids
   * @return {void}
   * @memberOf Yacs.user
   */
  self.setSelections = function(selections) {
    setCookie('selections', JSON.stringify(selections));
  };

  /**
   * Add a selection to those already selected. Return the success value.
   * This does an insertion sort into the selections list in order to maintain
   * its sorted order.
   * @param {String/Int} sid - the section id
   * @param {String/Int} cid - the course id of the parent course
   * @param {Boolean, optional} doNotify - whether to notify the observer
   * @return {Boolean} true if the selection was added, false if it was already present
   * @memberOf Yacs.user
   */
  self.addSelection = function (sid, cid, doNotify) {
    if(typeof doNotify == "undefined") {
      doNotify = true;
    }

    sid = parseInt(sid);
    if(isNaN(sid)) {
      // bad section id string, should NOT be added
      return false;
    }
    cid = parseInt(cid);
    if(isNaN(cid)) {
      return false;
    }

    var getSpliceIndex = function(array, val) {
      // assumes array size is > 0, array is sorted
      // return -1 if val exists in array already
      var start = 0, end = array.length;
      while(start < end) {
        var avg = (start+end) >>> 1;
        if(array[avg] == val) {
          return -1;
        }
        else if(array[avg] < val) {
          start = avg+1;
        }
        else {
          end = avg;
        }
      }
      return start;
    };

    var selections = self.getSelections();
    if(! (cid in selections)) {
      selections[cid] = [];
    }
    var spliceIndex = getSpliceIndex(selections[cid], sid);
    if(spliceIndex == -1) {
      return false;
    }
    selections[cid].splice(spliceIndex, 0, sid);
    self.setSelections(selections);
    if(doNotify) {
      observable.notify();
    }
    return true;
  };

  /** Add multiple selections to a single course in the cookie.
   * @param {String[]/Int[]} sids - List of section ids
   * @param {String} cid - the course id
   * @return {Boolean} true if any selections were inserted, false otherwise
   * @memberOf Yacs.user
   */
  self.addMultipleSelections = function(sids, cid) {
    var sidlen = sids.length;
    var inserted = false;
    for(var i=0; i<sidlen; ++i) {
      inserted = self.addSelection(sids[i], cid, false) || inserted;
    }
    observable.notify();
  };

  /**
   * Remove a selection from the cookie. Return the success value.
   * @param {String/Int} sid - the section id
   * @param {String} cid - the course id of the parent course
   * @return {Boolean} true if the selection was removed, false if it was not present
   * @memberOf Yacs.user
   */
  self.removeSelection = function (sid, cid) {
    var selections = self.getSelections();
    if(! (cid in selections)) {
      return false;
    }
    i = selections[cid].indexOf(parseInt(sid));
    if (i === -1) return false;
    selections[cid].splice(i, 1);
    if(selections[cid].length < 1) {
      delete selections[cid];
    }

    self.setSelections(selections);
    observable.notify();
    return true;
  };

  /** Remove one course and all its selections from the cookie.
   * @param {String} cid - the course id
   * @return {Boolean} true if the course id existed and was removed, false if not
   * @memberOf Yacs.user
   */
  self.removeCourse = function(cid) {
    var selections = self.getSelections();
    if(! (cid in selections)) {
      return false;
    }
    delete selections[cid];
    self.setSelections(selections);
    observable.notify();
    return true;
  };

  /**
   * Determine whether the user has already selected a given section ID
   * @param  {String} sid - the section id
   * @param {String} cid - the course id of the parent course
   * @return {Boolean} true if the section is selected, false if it is not
   * @memberOf Yacs.user
   */
  self.hasSelection = function (sid, cid) {
    var selections = self.getSelections();
    if(! (cid in selections)) {
      return false;
    }
    return selections[cid].indexOf(parseInt(sid)) !== -1;
  };

  /**
   * Determine whether a course has any selected sections and is thus considered "selected".
   * @param {String} cid - course id
   * @return {Boolean} whether a course has selected sections
   * @memberOf Yacs.user
   */
  self.courseIsSelected = function(cid) {
    var selections = self.getSelections();
    if(! (cid in selections)) {
      return false;
    }
    return selections[cid].length >= 1;
  };

  /**
   * Remove all selections from cookie
   * @memberOf Yacs.user
   */
  self.clearSelections = function () {
    setCookie('selections', '');
    observable.notify();
  };

}();
