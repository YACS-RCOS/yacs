/**
 * Schedule view. Displays periods of selected courses in a week grid.
 * @param {Object} data - Object containing schedule data as returned from the API
 * @return {undefined}
 * @memberOf Yacs.views
 */
Yacs.views.schedule = function (data) {
  Yacs.setContents(HandlebarsTemplates.schedule(data));
  var scheduleElement = document.querySelector('#scheduleContainer');
  var leftSwitchElement = document.querySelector('#leftSwitch');
  var rightSwitchElement = document.querySelector('#rightSwitch');
  var clearSwitchElement = document.querySelector('#clearButton');
  var scheduleNumElement = document.querySelector('#scheduleNum');
  var crnListElement = document.querySelector('#crnList');
  var schedule = new Schedule(scheduleContainer);
  var scheduleIndex = 0;


  // this function will be deprecated when backend is updated to use minutes-since-midnight format
  // see issue #102
  var toMinutes = function (timeString) {
    var int = parseInt(timeString);
    return Math.floor(int / 100) * 60 + int % 100;
  }

  var transformSchedule = function (schedule) {
    var events = [];
    var crns = [];

    schedule.sections.forEach(function (section) {
      var color = crns.indexOf(section.crn);
      if (color === -1) {
        crns.push(section.crn);
        color = crns.length - 1;
      }

      section.periods.forEach(function (period) {
        events.push({
          start: toMinutes(period.start),
          end: toMinutes(period.end),
          day: period.day,
          colorNum: color,
          title: section.department_code + ' ' + section.course_number + ' - ' + section.name
        });
      });
    });
    return { events: events, crns: crns };
  };

  var showSchedule = function (index) {
    var scheduleData = transformSchedule(data.schedules[index]);
    schedule.setEvents(scheduleData.events)
    scheduleNumElement.textContent = index + 1;
    crnListElement.textContent = 'CRNs: ' + scheduleData.crns.join(', ');
  }

  if(data.schedules.length == 0) {
    // TODO: this will happen if there are no available schedules
    return;
  }

  Yacs.on('click', leftSwitchElement, function () {
    scheduleIndex = (--scheduleIndex < 0 ? data.schedules.length - 1 : scheduleIndex);
    showSchedule(scheduleIndex);
  });
  Yacs.on('click', rightSwitchElement, function () {
    scheduleIndex = (++scheduleIndex < data.schedules.length ? scheduleIndex : 0);
    showSchedule(scheduleIndex);
  });
  Yacs.on('click', clearSwitchElement, function () {
      schedule.clearEvents();
      scheduleNumElement.textContent = 0;
      crnListElement.textContent = "";
  });

  showSchedule(scheduleIndex);
};
