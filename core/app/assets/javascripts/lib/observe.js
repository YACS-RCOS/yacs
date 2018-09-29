/**
 * Yacs.Observable is a dispatcher of custom events. Its aim is to provide
 * a DOM-bound interface for sending custom events to presently rendered views.
 * This is accomplished by dispatching said events to all elements with a
 * class matching the form 'listen-to-<name>'.
 * @param {String} name - name of the custom event
 * @memberOf Yacs
 */
'use strict';

Yacs.Observable = function (name) {
  var self = this;
  self.notify = function (data) {
    var event = document.createEvent('Event');
    event.initEvent(name, false, true);
    event.data = data;
    document.querySelectorAll('.listen-to-' + name).forEach(function (listener) {
      listener.dispatchEvent(event);
    });
  };
};

/**
 * Yacs.observer is the complementary, or listener interface to
 * Yacs.observable.
 * @param {String} name - name of event to observe
 * @param {HTMLElement} target - node to which the event will be bound
 * @param {Function} callback - function to respond to the event
 */
Yacs.observe = function (name, target, callback) {
  // var self = this;
  target.classList.add('listen-to-' + name);
  target.addEventListener(name, callback);
};
