/**
 * Create an ICS calendar file with all the current courses on it,
 * set to weekly, starting with the current week, and prompt the user to
 * download it.
 */
var createICS = function(periods) {
  var icsData = 'BEGIN:VCALENDAR\r\n'+
    'VERSION:2.0\r\n' +
    'PRODID:-//yacs//NONSGML v1.0//EN\r\n';

  var uidCounter = 0;

  // Helper to pad single digit numbers with a 0 and leave double digit numbers unchanged.
  var pad0 = function(num) { return ('0' + num).slice(-2); }

  // Helper to extract the ICS formatted time from a Date. It looks like this:
  // YYYYMMDDTHHMMSS, where T is a literal T
  var getICSstamp = function(d) {
    return d.getFullYear() + pad0(d.getMonth()+1) + pad0(d.getDate()) + 'T'
      + pad0(d.getHours()) + pad0(d.getMinutes()) + '00';
  }

  // Helper to convert a single period into a full VEVENT.
  var periodToVevent = function(period) {
    var d = new Date();
    var nowstamp = getICSstamp(d); // save for the DTSTAMP field

    // dates need to be shuffled around by setting the date, so calculate how much it
    // needs to move by
    var weekday_offset = period.day - d.getDay();
    d.setDate(d.getDate() + weekday_offset);

    // at this point the date is set correctly, then the time needs to be set
    d.setHours(Math.floor(period.start / 60));
    d.setMinutes(period.start % 60);

    var startstamp = getICSstamp(d);

    // compute end and take end stamp
    d.setMinutes(d.getMinutes() + (period.end - period.start));
    var endstamp = getICSstamp(d);

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
    icsData += periodToVevent(period);
  });
  icsData += 'END:VCALENDAR';

  // create a temporary <a> with the data and download file and simulate a click on it
  var elt = document.createElement('a');
  elt.setAttribute('href', 'data:text/calendar;charset=utf8,' + encodeURIComponent(icsData));
  elt.setAttribute('download', 'yacs-schedule.ics');
  document.body.appendChild(elt);
  elt.click();
  document.body.removeChild(elt);
};
