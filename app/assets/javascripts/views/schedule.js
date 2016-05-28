/**
 * Schedule view. Displays periods of selected courses in a week grid.
 * @param {Object} data - Object containing schedule data as returned from the API
 * @return {undefined}
 * @memberOf Yacs.views
 */
Yacs.views.schedule = function (data) {
  Yacs.setContents(HandlebarsTemplates.schedule());
  var scheduleContainer = document.querySelector('#scheduleContainer');
  var schedule = new Schedule(scheduleContainer);
  // if (data.schedules.length)
  //   schedule.addEvents(data.schedules[0]);
}