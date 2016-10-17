/**
 * Create an vCalendar file with all the current courses on it,
 * set to weekly, starting with the current week.
 */
var createVCalendar = function(periods) {
  var vCalendarData = 'BEGIN:VCALENDAR\r\n'+
    'VERSION:2.0\r\n' +
    'PRODID:-//yacs//NONSGML v1.0//EN\r\n';

  var uidCounter = 0;

  // Helper to pad single digit numbers with a 0 and leave double digit numbers unchanged.
  var pad0 = function(num) { return ('0' + num).slice(-2); }

  // Helper to extract the vCalendar formatted time from a Date. It looks like this:
  // YYYYMMDDTHHMMSS, where T is a literal T
  var getVCalendarStamp = function(d) {
    return d.getFullYear() + pad0(d.getMonth()+1) + pad0(d.getDate()) + 'T'
      + pad0(d.getHours()) + pad0(d.getMinutes()) + '00';
  }

  // Helper to convert a single period into a full VEVENT.
  var periodToVevent = function(period) {
    var d = new Date();
    var nowstamp = getVCalendarStamp(d); // save for the DTSTAMP field

    // dates need to be shuffled around by setting the date, so calculate how much it
    // needs to move by
    var weekday_offset = period.day - d.getDay();
    d.setDate(d.getDate() + weekday_offset);

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
      'RRULE:FREQ=WEEKLY' + '\r\n' +
      'END:VEVENT\r\n';

  };

  each(periods, function(period) {
    vCalendarData += periodToVevent(period);
  });
  vCalendarData += 'END:VCALENDAR';
  return vCalendarData;

};
