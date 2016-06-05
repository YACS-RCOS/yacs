/**
 * Schedule view. Displays periods of selected courses in a week grid.
 * @param {Object} data - Object containing schedule data as returned from the API
 * @return {undefined}
 * @memberOf Yacs.views
 */
Yacs.views.schedule = function (data) {
  // this function will be deprecated when backend is updated to use minutes-since-midnight format
  var toMinutes = function (timeString) {
    var int = parseInt(timeString);
    return Math.floor(int / 100) * 60 + int % 100;
  }

// NONE OF THIS IS DONE!
  var prepareData = function (schedule) {
    var events = [];
    schedule.sections.forEach(function (s) {
      s.periods.forEach(function (p) {
        events.push({
          start: toMinutes(p.start),
          end: toMinutes(p.end),
          day: p.day,
          type: s.course_number % 7, // TODO: do this correctly
          name: s.department_code + ' ' + s.course_number + ' - ' + s.name
        });
      });
    });
    return events;
  };

  Yacs.setContents(HandlebarsTemplates.schedule());
  var scheduleContainer = document.querySelector('#scheduleContainer');
  var schedule = new Schedule(scheduleContainer);
  var events = prepareData(data.schedules[0]);
  events.forEach (function (e) { schedule.addEvent(e); });
};
