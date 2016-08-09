/**
 * Schedules view. Displays periods of selected courses in a week grid.
 * @param {Object} data - Object containing schedule data as returned from the API
 * @return {undefined}
 * @memberOf Yacs.views
 */
Yacs.views.schedule = function (target) {
  target.innerHTML = HandlebarsTemplates.schedules();

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

  /**
   * Convert military time string to minutes-since-midnight integer form.
   * This function should be deprecated in issue #102
   */
  var toMinutes = function (timeString) {
    var int = parseInt(timeString);
    return Math.floor(int / 100) * 60 + int % 100;
  }

  /**
   * Translate schedules returned by the API into a displayable form.
   * For each schedule, convert period times ro minutes-since-midnight form,
   * and collect the CRNs from each section.
   * Additionally, determine the min star time and the max end time
   * of all of the schedules.
   */
  var processSchedules = function (schedules) {
    var start = 480;
    var end = 1200;
    var processedSchedules = schedules.map(function (schedule) {
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
          start = Math.min(start, toMinutes(period.start));
          end = Math.max(end, toMinutes(period.end));
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
    return { schedules: processedSchedules, start: start, end: end };
  };

  /**
   * Process schedules returned by the API, and update view accordingly,
   * setting the time range of the schedule view to accomodate all schedules.
   * If no schedules are available, show the appropriate status text.
   */
  var setSchedules = function (schedules) {
    var data = processSchedules(schedules);
    scheduleData = data.schedules;
    schedule.destroy();
    schedule = new Schedule(scheduleElement, 
      { timeBegin: Math.ceil((data.start) / 60) * 60,
        timeSpan: Math.ceil((data.end - data.start) / 60) * 60 });
    scheduleCountElement.textContent = scheduleData.length;
    if (scheduleData.length > 0) {
      show(0);
    } else {
      show(-1);
      if (Yacs.user.getSelections().length > 0) {
        scheduleStatusElement.textContent = "No schedules found :( Try removing some courses";
      } else {
        scheduleStatusElement.textContent = "Nothing to see here :) Try adding some courses";
      }
    }
  };

  /**
   * Query the server for schedules based on the stored selections,
   * and update the view to show the new schedules.
   * If no sections are selected, skip the call and show nil schedules.
   */
  var updateSchedules = function () {
    var selections = Yacs.user.getSelectionsRaw();
    if (selections.length > 0) {
      Yacs.models.schedules.query({ section_ids: selections,
                                    show_periods: true },
        function(data, success) {
          if (success) {
            setSchedules(data.schedules);
          } else {
            Yacs.user.clearSelections();
            setSchedules([]);
          }
      });
      clearButtonElement.disabled = false;
    } else {
      setSchedules([]);
      clearButtonElement.disabled = true;
    }
  };

  /**
   * Show schdule at given index, and display corresponding CRNs.
   * If index is -1, show nil schedule.
   */
  var show = function (index) {
    if (index == -1) {
      scheduleStatusElement.textContent = "";
      scheduleNumElement.textContent = 0;
    } else {
      schedule.setEvents(scheduleData[index].events)
      scheduleNumElement.textContent = index + 1;
      scheduleStatusElement.textContent = 'CRNs: ' + scheduleData[index].crns.join(', ');
    }
  };

  /**
   * Switch to schedule [[n + 1] % n] in the sequence
   */
  var next = function () {
    if (scheduleData.length > 0) {
      scheduleIndex = (++scheduleIndex < scheduleData.length ? scheduleIndex : 0);
      show(scheduleIndex);
    }
  }

  /**
   * Switch to schedule [[n - 1] % n] in the sequence
   */
  var previous = function () {
    if (scheduleData.length > 0) {
      scheduleIndex = (--scheduleIndex < 0 ? scheduleData.length - 1 : scheduleIndex);
      show(scheduleIndex);
    }
  }

  /**
   * Show next schedule if right is clicked or pressed,
   * show previous schedule if left is clicked or pressed
   */
  Yacs.on('click', leftSwitchElement, previous);
  Yacs.on('click', rightSwitchElement, next);
  Yacs.on('keydown', document, function (elem, event) { if (event.keyCode == 37) previous(); });
  Yacs.on('keydown', document, function (elem, event) { if (event.keyCode == 39) next(); });

  /**
   * Clear selections in cookie when clear button is pressed, and update
   * schedule and selctions views accordingly.
   */
  Yacs.on('click', clearButtonElement, function () {
    Yacs.user.clearSelections();
    updateSchedules();
  });

  /**
   * Show selected courses / sections on the schedule page.
   * Update schedules view when a course is clicked.
   * TODO: Use native event handling to update views when selection changes
   */
  var selections = Yacs.user.getSelections();
  if (selections.length > 0) {
    Yacs.models.courses.query({
      section_id: selections.join(','),
      show_sections: true,
      show_periods: true },
      function (data, success) {
        if (success) {
          Yacs.views.courses(selectionElement, data);
        }
      }
    );
  }

  Yacs.observe('selection', scheduleElement, updateSchedules);

  updateSchedules();
};
