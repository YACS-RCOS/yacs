/**
 * @namespace vCalendar
 * @description Functions associated with the vCalendar (ICS) download on the schedule page
 * @memberOf Yacs
 */
'use strict';

Yacs.vCalendar = new function () {
  var self = this;

  /**
   * Given a set of periods in the same form as they would be used
   * to generate a single schedule, return a string containing
   * that data formatted into a VCalendar, which if it were a file
   * could be imported into a calendar application.
   * All periods are set to recur weekly, starting at the current
   * week.
   * @param {Object[]} periods - array of period objects as they appear after being processed by the schedules controller (events)
   * @return {String} The VCalendar file data as a string
   */
  self.createVCalendar = function(periods) {
    var vCalendarData = 'BEGIN:VCALENDAR\r\n' +
      'VERSION:2.0\r\n' +
      'PRODID:-//yacs//NONSGML v1.0//EN\r\n';

    var uidCounter = 0;

    // Helper to pad single digit numbers with a 0 and leave double digit numbers unchanged.
    var pad0 = function(num) {
      return ('0' + num).slice(-2);
    };

    // Helper to extract the vCalendar formatted time from a Date. It looks like this:
    // YYYYMMDDTHHMMSS, where T is a literal T
    var getVCalendarStamp = function(d) {
      return d.getFullYear() + pad0(d.getMonth() + 1) + pad0(d.getDate()) + 'T' +
        pad0(d.getHours()) + pad0(d.getMinutes()) + '00';
    };

    // Helper to convert a single period into a full VEVENT.
    var periodToVevent = function(period) {
      var d = new Date();
      var nowstamp = getVCalendarStamp(d); // save for the DTSTAMP field

      // dates need to be shuffled around by setting the date, so calculate how much it
      // needs to move by
      var weekdayOffset = period.day - d.getDay();
      d.setDate(d.getDate() + weekdayOffset);

      // at this point the date is set correctly, then the time needs to be set
      d.setHours(Math.floor(period.start / 60));
      d.setMinutes(period.start % 60);

      var startstamp = getVCalendarStamp(d);

      // compute end and take end stamp
      d.setMinutes(d.getMinutes() + (period.end - period.start));
      var endstamp = getVCalendarStamp(d);

      uidCounter++;
      return 'BEGIN:VEVENT\r\n' +
        'UID:event' + uidCounter + '@yacs.cs.rpi.edu\r\n' +
        'SUMMARY:' + period.tooltip + '\r\n' +
        'DTSTAMP:' + nowstamp + '\r\n' +
        'DTSTART:' + startstamp + '\r\n' +
        'DTEND:' + endstamp + '\r\n' +
        'RRULE:FREQ=WEEKLY\r\n' +
        'END:VEVENT\r\n';
    };

    periods.forEach(function(period) {
      vCalendarData += periodToVevent(period);
    });
    vCalendarData += 'END:VCALENDAR';
    return vCalendarData;
  };

  /**
   * Prompt the user to download a vCalendar string as a file
   * named yacs-schedule.ics.
   * Do this by attaching a phantom <a> to the DOM and setting its
   * href to the calendar data, then simulating a click on it.
   * @param {String} vCalendarData - Raw VCalendar file data returned by createVCalendar().
   */
  self.download = function(vCalendarData) {
    var elt = document.createElement('a');
    elt.setAttribute('href', 'data:text/calendar;charset=utf8,' + encodeURIComponent(vCalendarData));
    elt.setAttribute('download', 'yacs-schedule.ics');
    document.body.appendChild(elt);
    elt.click();
    document.body.removeChild(elt);
  };
}();
