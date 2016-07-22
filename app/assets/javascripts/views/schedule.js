/**
 * Schedule view. Displays periods of selected courses in a week grid.
 * @param {Object} data - Object containing schedule data as returned from the API
 * @return {undefined}
 * @memberOf Yacs.views
 */
Yacs.views.schedule = function (target) {
  target.innerHTML = HandlebarsTemplates.schedule();

  var scheduleElement = target.querySelector('#schedule-container');
  var selectionElement = target.querySelector('#selection-container')
  var leftSwitchElement = target.querySelector('#left-switch');
  var rightSwitchElement = target.querySelector('#right-switch');
  var clearButtonElement = target.querySelector('#clear-btn');
  var scheduleNumElement = target.querySelector('#schedule-num');
  var scheduleCountElement = target.querySelector('#schedule-count');
  var scheduleStatusElement = target.querySelector('#schedule-status');
  var crnListElement = target.querySelector('#crn-list');
  var schedule = new Schedule(scheduleElement);
  var scheduleData = [];
  var scheduleIndex = 0;

  // this function will be deprecated when backend is updated to use minutes-since-midnight format
  // see issue #102
  var toMinutes = function (timeString) {
    var int = parseInt(timeString);
    return Math.floor(int / 100) * 60 + int % 100;
  }

  var processSchedules = function (schedules) {
    return schedules.map(function (schedule) {
      var courseIds = [];
      var events = [];
      var crns = [];
      schedule.sections.forEach(function (section) {
        var color = courseIds.indexOf(section.course_id);
        if (color == -1) {
          courseIds.push(section.course_id);
          color = courseIds.length - 1;
        }
        crns.push(section.crn)
        section.periods.forEach(function (period) {
          events.push({
            start: toMinutes(period.start),
            end: toMinutes(period.end),
            day: period.day,
            colorNum: color,
            title: [
              section.department_code + ' ' + section.course_number + ' - ' + section.name,
              section.crn,
              section.instructors[0] || ''
            ]
          });
        });
      });
      return { events: events, crns: crns };
    });
  };

  var setSchedules = function (schedules) {
    schedule.clearEvents();
    scheduleData = processSchedules(schedules);
    scheduleCountElement.textContent = schedules.length;
    if (scheduleData.length > 0) {
      show(0);
      scheduleStatusElement.textContent = " ";
    } else {
      show(-1);
      if (Yacs.user.getSelections().length > 0) {
        scheduleStatusElement.textContent = "No schedules found :( Try removing some courses";
      } else {
        scheduleStatusElement.textContent = "Nothing to see here :) Try adding some courses";
      }
    }
  };

  var updateSchedules = function () {
    console.log('updating schedules');
    var selections = Yacs.user.getSelectionsRaw();
    if (selections.length > 0) {
      Yacs.models.schedules.query({ section_ids: selections,
                                    show_periods: true },
        function(data, success) {
          if (success)
            setSchedules(data.schedules);
      });
      clearButtonElement.disabled = false;
    } else {
      setSchedules([]);
      clearButtonElement.disabled = true;
    }
  };

  var show = function (index) {
    if (index == -1) {
      crnListElement.textContent = "";
      scheduleNumElement.textContent = 0;
    } else {
      schedule.setEvents(scheduleData[index].events)
      scheduleNumElement.textContent = index + 1;
      crnListElement.textContent = 'CRNs: ' + scheduleData[index].crns.join(', ');
    }
  };

  var next = function () {
    scheduleIndex = (++scheduleIndex < scheduleData.length ? scheduleIndex : 0);
    show(scheduleIndex);
  }

  var previous = function () {
    scheduleIndex = (--scheduleIndex < 0 ? scheduleData.length - 1 : scheduleIndex);
    show(scheduleIndex);
  }

  Yacs.on('click', clearButtonElement, function () {
    Yacs.user.clearSelections();
    updateSchedules();
    target.querySelectorAll('course-info').forEach(function (ci) {
      ci.classList.remove('selected');
    });
    target.querySelectorAll('section').forEach(function (s) {
      s.classList.remove('selected');
    });
  });

  Yacs.on('click', leftSwitchElement, previous);
  Yacs.on('click', rightSwitchElement, next);
  Yacs.on('keydown', document, function (elem, event) { if (event.keyCode == 37) previous(); });
  Yacs.on('keydown', document, function (elem, event) { if (event.keyCode == 39) next(); });

  // TODO: Implement observers for selections
  var selections = Yacs.user.getSelections();
  if (selections.length > 0) {
    Yacs.models.courses.query({ section_id: selections.join(','),
                                show_sections: true,
                                show_periods: true },
      function (data, success) {
        if (success) {
          Yacs.views.courses(selectionElement, data);
          target.querySelectorAll('course').forEach(function (course) {
            Yacs.on('click', course, updateSchedules);
          });
        }
    });
  }

  updateSchedules();
};
