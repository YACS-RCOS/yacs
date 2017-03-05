/**
 * Schedules view. Displays periods of selected courses in a week grid.
 * @param {HTMLElement} target- The element in which this view should be rendered
 * @param {Object} params - API params for this view
 * @return {undefined}
 * @memberOf Yacs.views
 */

'use strict';

Yacs.views.schedules = function (target, params) {
  // before doing anything, determine how to use the route
  // parameters to choose the section ids to be passed to the
  // API
  var scheduleIDs = [];

  // check for query parameters
  if ('section_ids' in params) {
    // if there are query parameters,
    // use them and ignore current selections
    scheduleIDs = params.section_ids.split(',');

    // If the cookie doesn't have any selections,
    // write them into it. The URL will still display the parameters as long as
    // the route doesn't change.
    if (Yacs.user.getSelections().length <= 0) {
      Yacs.user.addSelections(scheduleIDs);
    }
  }
  else {
    // if section_ids is not specified in params, use the cookie
    // to populate the scheduleIDs list
    scheduleIDs = Yacs.user.getSelections();
  }

  // initialize scheduleIndex at 0, unless explicitly specified in the query
  // parameters
  var scheduleIndex = 0;
  if ('schedule_index' in params) {
    scheduleIndex = parseInt(params.schedule_index);
  }

  Yacs.render(target, 'schedules');

  var scheduleElement = target.querySelector('#schedule-container');
  var selectionElement = target.querySelector('#selection-container');
  var leftSwitchElement = target.querySelector('#left-switch');
  var rightSwitchElement = target.querySelector('#right-switch');
  var clearButtonElement = target.querySelector('#clear-btn');
  var scheduleNumElement = target.querySelector('#schedule-num');
  var scheduleCountElement = target.querySelector('#schedule-count');
  var scheduleStatusElement = target.querySelector('#schedule-status');
  var downloadICSElement = target.querySelector('#ics-btn');
  var copyLinkElement = target.querySelector('#link-btn');
  var scheduleInstance = new Schedule(scheduleElement);
  var scheduleData = [];

  /**
   * Convert military time string to minutes-since-midnight integer form.
   * This function should be deprecated in issue #102
   * @param {string} timeString - The military time to convert.
   * @return {int} The minutes since midnight represented by the military time.
   */
  var toMinutes = function (timeString) {
    var int = parseInt(timeString);
    return (Math.floor(int / 100) * 60) + (int % 100);
  };

  /**
   * Show schedule at given index, and display corresponding CRNs.
   * If index is -1, show nil schedule.
   * @param {int} index - The index of the schedule to show, or -1 if showing nothing
   */
  var showSchedule = function (index) {
    if (index === -1) {
      scheduleStatusElement.textContent = '';
      scheduleNumElement.textContent = 0;
    }
    else {
      scheduleInstance.setEvents(scheduleData[index].events);
      scheduleNumElement.textContent = index + 1;
      var scheduleStatusStr = 'CRNs: ' + scheduleData[index].crns.join(', ');
      scheduleStatusElement.textContent = scheduleStatusStr;
    }
  };

  /**
   * Translate schedules returned by the API into a displayable form.
   * For each schedule, convert period times to minutes-since-midnight form,
   * and collect the CRNs from each section.
   * Additionally, determine the min star time and the max end time
   * of all of the schedules.
   * @param {Object} schedules - The object containing all schedule information returned from the API.
   * @return {Object} An object containing: the schedules reformatted as lists of events and crns, and the start and end times of the schedule.
   */
  var processSchedules = function (schedules) {
    var start = 480; // 8AM
    var end = 1200; // 8PM
    var processedSchedules = schedules.map(function (schedule) {
      var courseIds = [];
      var events = [];
      var crns = [];
      schedule.sections.forEach(function (section) {
        var color = courseIds.indexOf(section.course_id);
        if (color === -1) {
          courseIds.push(section.course_id);
          color = courseIds.length - 1;
        }
        crns.push(section.crn);
        section.periods.forEach(function (period) {
          start = Math.min(start, toMinutes(period.start));
          end = Math.max(end, toMinutes(period.end));
          events.push({
            'start': toMinutes(period.start),
            'end': toMinutes(period.end),
            'day': period.day,
            'colorNum': color,
            'title': [
              section.department_code + ' ' + section.course_number + ' - ' + section.name,
              section.crn,
              section.instructors[0] || ''
            ],
            'tooltip': section.course_name
          });
        });
      });
      return {
        'events': events,
        'crns': crns
      };
    });
    return {
      'schedules': processedSchedules,
      'start': start,
      'end': end
    };
  };

  /**
   * Process schedules returned by the API, and update view accordingly,
   * setting the time range of the schedule view to accomodate all schedules.
   * If no schedules are available, show the appropriate status text.
   * @param {Object} schedules - The raw schedules object returned from the API
   */
  var setSchedules = function (schedules) {
    var data = processSchedules(schedules);
    scheduleData = data.schedules;
    scheduleInstance.destroy();
    scheduleInstance = new Schedule(
      scheduleElement,
      {
        'timeBegin': Math.ceil(data.start / 60) * 60,
        'timeSpan': Math.ceil((data.end - data.start) / 60) * 60
      }
    );
    scheduleCountElement.textContent = scheduleData.length;
    if (scheduleData.length > 0) {
      showSchedule(scheduleIndex);
    }
    else {
      showSchedule(-1);
      if (Yacs.user.getSelections().length > 0) {
        scheduleStatusElement.textContent = 'No schedules found :( Try removing some courses';
      }
      else {
        scheduleStatusElement.textContent = 'Nothing to see here :) Try adding some courses';
      }
    }
  };

  /**
   * Query the server for schedules based on the stored selections,
   * and update the view to show the new schedules.
   * If no sections are selected, skip the call and show nil schedules.
   * @param {Object} selections - An array of selected section IDs. May be undefined; if so, get currently selected sections.
   */
  var updateSchedules = function (selections) {
    var currSelections = selections;
    if (typeof selections === 'undefined') {
      currSelections = Yacs.user.getSelections();
    }
    if (currSelections.length > 0) {
      Yacs.models.schedules.query(
        {
          'section_ids': currSelections,
          'show_periods': true
        },
        function(data, success) {
          if (success) {
            setSchedules(data.schedules);
          }
          else {
            Yacs.user.clearSelections();
            setSchedules([]);
          }
        }
      );
      clearButtonElement.disabled = false;
    }
    else {
      setSchedules([]);
      clearButtonElement.disabled = true;
    }
  };

  /**
   * Format the current schedule as a vCalendar (ICS file format),
   * and prompt the user to download it as a file.
   */
  var getICSDownload = function() {
    if (scheduleData.length < 1) {
      return;
    }

    // current periods being displayed only
    var periods = scheduleData[scheduleIndex].events;
    var vCalendarData = Yacs.vCalendar.createVCalendar(periods);
    Yacs.vCalendar.download(vCalendarData);
  };

  /*
   * Generate a link to this set of schedules from current selections
   * and copy it to the user's clipboard.
   */
  var copyScheduleLink = function() {
    var targetUrl = window.location.protocol + '//' +
      window.location.host +
      '/#/schedules?section_ids=' + Yacs.user.getSelections().join(',') +
      '&schedule_index=' + scheduleIndex;

    // js hack to create and copy from a phantom element
    var textarea = document.createElement('textarea');
    textarea.value = targetUrl;
    document.body.appendChild(textarea);
    textarea.select();
    var success = document.execCommand('copy');
    if (!success) {
      // maybe add some code here later to show an error message
    }
    document.body.removeChild(textarea);
  };

  /**
   * Switch to schedule [[n + 1] % n] in the sequence
   */
  var nextSchedule = function () {
    if (scheduleData.length > 0) {
      scheduleIndex++;
      if (scheduleIndex >= scheduleData.length) {
        scheduleIndex = 0;
      }
      showSchedule(scheduleIndex);
    }
  };

  /**
   * Switch to schedule [[n - 1] % n] in the sequence
   */
  var prevSchedule = function () {
    if (scheduleData.length > 0) {
      scheduleIndex--;
      if (scheduleIndex < 0) {
        scheduleIndex = scheduleData.length - 1;
      }
      showSchedule(scheduleIndex);
    }
  };

  /**
   * Show next schedule if right is clicked or pressed,
   * show previous schedule if left is clicked or pressed
   */
  Yacs.on('click', leftSwitchElement, prevSchedule);
  Yacs.on('click', rightSwitchElement, nextSchedule);
  Yacs.on('keydown', document, function (elem, event) {
    if (event.keyCode === 37) {
      prevSchedule();
    }
  });
  Yacs.on('keydown', document, function (elem, event) {
    if (event.keyCode === 39) {
      nextSchedule();
    }
  });

  /**
   * Clear selections in cookie when clear button is pressed, and update
   * schedule and selctions views accordingly.
   */
  Yacs.on('click', clearButtonElement, function () {
    Yacs.user.clearSelections();
  });

  /* Prompt the creation and download of the schedule ICS when the button is clicked.
   */
  Yacs.on('click', downloadICSElement, getICSDownload);

  /**
   * Copy a link to this set of schedules to the user's clipboard.
   */
  Yacs.on('click', copyLinkElement, copyScheduleLink);

  /**
   * Show selected courses / sections on the schedule page. The courses shown
   * are explicitly the courses that had one or more sections selected at the
   * time the view was rendered.
   */
  var selections = Yacs.user.getSelections();
  if (selections.length > 0) {
    Yacs.views.courses(selectionElement, { 'section_id': selections });
  }

  // refresh schedules whenever selections in the list beneath change
  Yacs.observe('selection', scheduleElement, function() {
    // will use current selections by default
    updateSchedules();
  });

  // use section ids extracted from URL parameters at top
  updateSchedules(scheduleIDs);
};
