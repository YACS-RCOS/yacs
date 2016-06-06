/**
 * Schedule view. Displays periods of selected courses in a week grid.
 * @param {Object} data - Object containing schedule data as returned from the API
 * @return {undefined}
 * @memberOf Yacs.views
 */
Yacs.views.schedule = function (data) {
  if(data.schedules.length == 0) {
    // TODO: this will happen if there are no available schedules
    return;
  }
  console.log(data);
  // this function will be deprecated when backend is updated to use minutes-since-midnight format
  // see issue #102
  var toMinutes = function (timeString) {
    var int = parseInt(timeString);
    return Math.floor(int / 100) * 60 + int % 100;
  }

// NONE OF THIS IS DONE!
  var prepareData = function (schedule) {
    var events = [];

    // "map" of course numbers to color numbers (which are their indices)
    var courseNums = [];

    // perhaps these forEach loops should be converted to normal for loops
    // to increase performance
    schedule.sections.forEach(function (section) {

      // if the course number exists in courseNums, use the index there;
      // else push it on and use the index given to it
      var color = courseNums.indexOf(section.course_number);
      if(color === -1) {
        courseNums.push(section.course_number);
        color = courseNums.length-1;
      }

      section.periods.forEach(function (period) {
        events.push({
          start: toMinutes(period.start),
          end: toMinutes(period.end),
          day: period.day,
          colornum: color,
          title: section.department_code + ' ' + section.course_number + ' - ' + section.name
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
