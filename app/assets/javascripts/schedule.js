/*
var Schedule = function (scheduleContainer, options) {
  var self = this;
  
  var NUM_COLORS        = 7;
  var TEXT_COLORS       = ['#d1265d', '#1577aa', '#bf8a2e', '#008a2e', '#853d80', '#9d5733', '#d9652b'];
  var BACKGROUND_COLORS = ['#ffd4df', '#ceeffc', '#fff4d0', '#dcf7da', '#f7e2f7', '#ede6df', '#ffe9cf'];
  var BORDER_COLORS     = ['#ff2066', '#00aff2', '#ffcb45', '#48da58', '#d373da', '#a48363', '#ff9332'];
  var SELECTED_COLORS   = ['#ff3575', '#19b5f2', '#ffcf56', '#59dc68', '#d57fdd', '#ac8f71', '#ff9c46'];
  //                         PINK       BLUE       YELLOW ,   GREEN      PURPLE     BROWN      ORANGE
  
  options = options || {};
  options.timeBegin = options.timeBegin || 8 * 60;
  options.timeSpan  = options.timeSpan  || 12 * 60;
  options.dayBegin  = options.dayBegin  || 1;
  options.daySpan   = options.daySpan   || 5;
  options.gridSize  = options.gridSize  || 60;
  
  var scheduleElement = document.createElement('schedule-view');
  var legendElement   = document.createElement('schedule-legend');
  var gridElement     = document.createElement('schedule-grid');

  scheduleElement.appendChild(legendElement);
  scheduleElement.appendChild(gridElement);
  scheduleContainer.appendChild(scheduleElement);
  
  var daySize = function (n) {
    return n * (100 / options.daySpan) + '%';
  };

  var timeSize = function (n) {
    return n * (100 / options.timeSpan) + '%';
  };
  
  self.addEvent = function (event) {
    var eventText       = document.createElement('event-text');
    var eventElement    = document.createElement('schedule-event');
    var eventBackground = document.createElement('event-background');
    var colorIndex      = Math.floor(event.type % NUM_COLORS);
    
    eventText.textContent                 = event.name;
    eventText.style.color                 = TEXT_COLORS[colorIndex];
    eventElement.style.top                = timeSize(event.start - options.timeBegin);
    eventElement.style.left               = daySize(event.day - options.dayBegin);
    eventElement.style.width              = 'calc(' + daySize(1) + ' - 6px)';
    eventElement.style.height             = 'calc(' + timeSize(event.end - event.start) + ' - 2px)';
    eventElement.style.borderColor        = BORDER_COLORS[colorIndex];
    eventBackground.style.backgroundColor = BACKGROUND_COLORS[colorIndex];

    eventElement.appendChild(eventBackground);
    eventElement.appendChild(eventText);
    scheduleElement.appendChild(eventElement);
  };

  self.clearEvents = function () {
    var events = scheduleElement.querySelectorAll('schedule-event');
    for (var e = 0; e < events.length; ++e)
      events[e].remove();
  }
  
  var drawLegend = function () {
    for (var r = 1; r < options.timeSpan / options.gridSize; ++r) {
      var hourElement = document.createElement('legend-hour');
      var hour = options.timeBegin / options.gridSize + r;

      if      (hour == 0)  hour = '12 AM';
      else if (hour == 12) hour = 'Noon';
      else if (hour < 12)  hour = hour + ' AM';
      else                 hour = hour - 12 + ' PM';

      hourElement.textContent = hour;
      hourElement.style.top = 'calc(' + timeSize(options.gridSize * r) + ' - 0.75em)';
      legendElement.appendChild(hourElement);
    }
  };

  var drawGrid = function () {
    for (var d = 0; d < options.daySpan; ++d) {
      var dayElement = document.createElement('grid-day');
      dayElement.style.width = daySize(1);

      for (var r = 0; r < options.timeSpan / options.gridSize; ++r) {
        var hourElement = document.createElement('grid-hour');
        hourElement.style.height = timeSize(options.gridSize);
        dayElement.appendChild(hourElement);
      }

      gridElement.appendChild(dayElement);
    }
  };
  
  drawLegend();
  drawGrid();
};
*/

/**
 * Schedule view. Displays periods of selected courses in a week grid.
 * @param {Object} data - Object containing schedule data as returned from the API
 * @return {undefined}
 * @memberOf Yacs.views
 */
Yacs.views.schedule = function(data) {
  alert('fsjdf');
  console.log(data);
  //Yacs.setContents(data);
};

/*
var sched = new Schedule(document.querySelector('#schedule-container'));
for (var p in periods)
  sched.addEvent(periods[p]);
  */
