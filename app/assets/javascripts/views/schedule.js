Yacs.views.schedule = function (data) {
  Yacs.setContents(HandlebarsTemplates.schedule());
  var scheduleContainer = document.querySelector('#scheduleContainer');
  var schedule = new Schedule(scheduleContainer);
  if (data.schedules.length)
    schedule.addEvents(data.schedules[0]);
}