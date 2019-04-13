/**
 * Schedule function. Initializes a Schedule object and renders it inside
 * a provided element. A Schedule represents a weekly schedule.
 * @constructor
 * @param {HTMLElement} scheduleContainer - The HTML element in which to render the schedule grid.
 * @param {Object} options - An object containing any of several fields to determine the time ranges of the schedule.
 * @param {int} options.daySpan - The number of days to display. Default is 5.
 * @param {int} options.dayBegin - The first day of the week to show (week is Sunday to Saturday, Sunday = 0). Default is 1 (Monday).
 * @param {int} options.gridSize - The number of minutes represented by each grid box vertically. Changing this does not change the overall size of the schedule. Default is 60.
 * @param {int} options.timeSpan - The total nuber of minutes to display. Rounds up to the nearest hour. Default is 720 (12 hours).
 * @param {int} options.timeBegin - The starting minute of the schedule, in minutes since midnight format. Default is 480 (8 AM).
 */
'use strict';

window.Schedule = function (scheduleContainer, givenOptions) {
  var self = this;

  /*                       PINK       BLUE       YELLOW     GREEN      PURPLE     BROWN      ORANGE */
  /* var SELECTED_COLORS = ['#ff3575', '#19b5f2', '#ffcf56', '#59dc68', '#d57fdd', '#ac8f71', '#ff9c46']; */
  var TEXT_COLORS       = ['#d1265d', '#1577aa', '#bf8a2e', '#008a2e', '#853d80', '#9d5733', '#d9652b'];
  var BACKGROUND_COLORS = ['#ffd4df', '#ceeffc', '#fff4d0', '#dcf7da', '#f7e2f7', '#ede6df', '#ffe9cf'];
  var BORDER_COLORS     = ['#ff2066', '#00aff2', '#ffcb45', '#48da58', '#d373da', '#a48363', '#ff9332'];
  var NUM_COLORS = Math.min(TEXT_COLORS.length, BACKGROUND_COLORS.length, BORDER_COLORS.length);
  var DAY_NAMES         = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // var TEXT_COLORS       = ['#720', '#722', '#661', '#227', '#166', '#616'];
  // var BACKGROUND_COLORS = ['#fdc', '#edd', '#eed', '#dde', '#dee', '#ede'];
  // var BORDER_COLORS     = ['#b62', '#b44', '#994', '#448', '#499', '#949'];

  var options = givenOptions || {};
  options.daySpan = options.daySpan || 5;
  options.dayBegin = options.dayBegin || 1;
  options.gridSize = options.gridSize || 60;
  options.timeSpan = Math.ceil((options.timeSpan || 720) / 60) * 60;
  options.timeBegin = Math.ceil((options.timeBegin || 480) / 60) * 60;

  var scheduleElement = document.createElement('schedule-view');
  var legendElement   = document.createElement('schedule-legend');
  var gridElement     = document.createElement('schedule-grid');

  scheduleElement.appendChild(legendElement);
  scheduleElement.appendChild(gridElement);
  scheduleContainer.appendChild(scheduleElement);

  /**
   * Computes the left offset of the given day, as a percentage.
   * @param {int} n - the day to compute the offset of. This means "nth day on the schedule", not "nth day of the week".
   * @return {String} The percentage offset of this day on the schedule.
   */
  var dayOffset = function (n) {
    return (n * 100 / options.daySpan) + '%';
  };

  // The width of a single day, as a percentage. This is fixed based on the number of days.
  var dayWidth = (100 / options.daySpan) + '%';

  /**
   * Computes the top offset of the given minute, as a percentage.
   * @param {int} n - the minute to compute the offset of. This means "nth minute since the beginning of the schedule", not "nth minute since midnight".
   * @return {String} The percentage offset of this minute on the schedule.
   */
  var timeOffset = function (n) {
    return (n * 100 / options.timeSpan) + '%';
  };

  self.addEvent = function (event) {
    var eventText       = document.createElement('event-text');
    var eventElement    = document.createElement('schedule-event');
    var eventBackground = document.createElement('event-background');
    var colorIndex      = event.colorNum % NUM_COLORS;

    /* This uses smelly hacks to calculate the exact size needed,
     * which depend on the associated CSS code.
     * 16px = exact offset to account for day-label at top of column
     * -5px = eat up 4px of schedule-element left border and 1px of grid-hour right border
     * -1px = eat up 1px of grid-hour bottom border
     * Anyone in the future who wants to figure out some way to not have to do these offsets, PLEASE do.
     */
    eventText.innerHTML = event.title.join('<br>');
    eventText.style.color = TEXT_COLORS[colorIndex];
    eventElement.style.top = 'calc(' + timeOffset(event.start - options.timeBegin) + ' + 16px)';
    eventElement.style.left = dayOffset(event.day - options.dayBegin);
    eventElement.style.width = 'calc(' + dayWidth + ' - 5px)';
    eventElement.style.height = 'calc(' + timeOffset(event.end - event.start) + ' - 1px)';
    eventElement.style.borderColor = BORDER_COLORS[colorIndex];
    eventBackground.style.backgroundColor = BACKGROUND_COLORS[colorIndex];

    if ('tooltip' in event) {
      eventElement.title = event.tooltip;
    }

    eventElement.appendChild(eventBackground);
    eventElement.appendChild(eventText);
    scheduleElement.appendChild(eventElement);
  };

  self.clearEvents = function () {
    var events = scheduleElement.querySelectorAll('schedule-event');
    for (var e = 0; e < events.length; ++e) {
      events[e].parentNode.removeChild(events[e]);
    }
  };

  self.setEvents = function (events) {
    self.clearEvents();
    events.forEach(function (event) {
      self.addEvent(event);
    });
  };

  self.destroy = function () {
    scheduleContainer.removeChild(scheduleElement);
  };

  var drawLegend = function () {
    for (var r = 0; r < options.timeSpan / 60 + 1; ++r) {
      var hourElement = document.createElement('legend-hour');
      var hour = (options.timeBegin / 60) + r;

      if (hour === 0) {
        hour = '12 AM';
      }
      else if (hour < 12) {
        hour = hour + ' AM';
      }
      else if (hour === 12) {
        hour = 'Noon';
      }
      else {
        hour = (hour - 12) + ' PM';
      }

      hourElement.textContent = hour;
      hourElement.style.top = 'calc(' + timeOffset(60 * r) + ' + 0.95em)';
      legendElement.appendChild(hourElement);
    }
  };

  var drawGrid = function () {
    for (var d = 0; d < options.daySpan; ++d) {
      var dayElement = document.createElement('grid-day');
      dayElement.style.width = dayWidth;

      // add day label to the top of each day column
      var dayLabel = document.createElement('day-label');
      dayLabel.textContent = DAY_NAMES[d + options.dayBegin];
      dayElement.appendChild(dayLabel);

      for (var r = 0; r < options.timeSpan / options.gridSize; ++r) {
        var hourElement = document.createElement('grid-hour');
        hourElement.style.height = timeOffset(options.gridSize);
        dayElement.appendChild(hourElement);
      }

      gridElement.appendChild(dayElement);
    }
  };

  drawLegend();
  drawGrid();
};
