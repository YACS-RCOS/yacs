// Generic helper function to convert a numeric hour into its string AM/PM form.
// If there is a place in the Javascript for globally accessible helper functions, this should go there.
function hourToString(hour) {
  if(hour == 0) return '12 AM';
  else if(hour < 12) return hour + ' AM';
  else if(hour === 12) return '12 PM';
  else return (hour-12) + ' PM';
}

// Generic repeater helper
Handlebars.registerHelper('repeat', function(n, block) {
  var output = '';
  for(var i=0; i < n; ++i) {
    output += block.fn(this);
  }
  return output;
});

Handlebars.registerHelper('timeLoop', function(start, end, block) {
  var output = '';
  var totalHours = end-start;
  var gridHourHeightPercentage = 100 * (1 / totalHours);
  for(var hour=start; hour< end; ++hour) {
    output += block.fn({
      offsetPercentage: (100 * (hour - start) / totalHours),
      hourString: hourToString(hour),
      heightPercentage: gridHourHeightPercentage,
    });
  }
  return output;
});

Handlebars.registerHelper('eventsLoop', function(schedule, block) {
  var output = '';
  for(var i=0; i<schedule.events.length; ++i) {
    var event = schedule.events[i];
    var minutesFromTop = event.start - (schedule.earliestStartHour * 60);
    var totalMinutes = (schedule.latestEndHour - schedule.earliestStartHour) * 60;

    var newVariables = {
      leftOffset: (event.day - schedule.startDay) * schedule.dayWidthPercentage,
      topOffset: 100 * (minutesFromTop / totalMinutes),
      eventHeightPercentage: 100 * ((event.end - event.start) / totalMinutes),
      'event': event,
      colorNumber: event.colorNum % 6,
    };
    for(var attr in newVariables) { this[attr] = newVariables[attr]; }
    output += block.fn(this);
  }
  return output;
});

/**
 * Schedule view. Displays periods of selected courses in a week grid.
 * @param {Object} data - Object containing schedule data as returned from the API
 * @return {undefined}
 * @memberOf Yacs.views
 */
Yacs.views.schedule = function (data) {
  var self = this;

  // declare all functions that will be used before running any code

  // this function will be deprecated when API is updated to use minutes-since-midnight format
  // see issue #102
  var toMinutes = function (timeString) {
    var int = parseInt(timeString);
    return Math.floor(int / 100) * 60 + int % 100;
  };

  // Convert a schedule object as served by the API to an object containing a
  // list of events and CRNs that will be rendered by the single_schedule
  // template. The returned data should be exactly what the template needs and
  // nothing else.
  var transformSchedule = function (schedule) {
    var events = [];
    var crns = [];
    var earliestStart = 1339;
    var latestEnd = 0;
    var earliestDay = 1; // Monday
    var latestDay = 5; // Friday

    schedule.sections.forEach(function (section) {
      var color = crns.indexOf(section.crn);
      if (color === -1) {
        crns.push(section.crn);
        color = crns.length - 1;
      }

      section.periods.forEach(function (period) {
        // adjust earliestStart/latestEnd if this period falls outside them
        var s = toMinutes(period.start);
        var e = toMinutes(period.end);
        earliestStart = (s < earliestStart ? s : earliestStart);
        latestEnd = (e > latestEnd ? e : latestEnd);

        // adjust earliestDay/latestDay if this period falls outside them
        earliestDay = (period.day < earliestDay ? period.day : earliestDay);
        latestDay = (period.day > latestDay ? period.day : latestDay);

        events.push({
          start: s,
          end: e,
          day: period.day,
          colorNum: color,
          title: section.department_code + ' ' + section.course_number + ' - ' + section.name
        });
      });
    });
    // round earliestStart down to multiple of 60 and latestEnd up
    var startHour = Math.floor(earliestStart / 60);
    var endHour = Math.ceil(latestEnd / 60);
    return {
      // list of event data
      events: events,
      // list of CRNs
      crns: crns,
      // first hour that needs to be shown because there is a period in it
      earliestStartHour: startHour,
      // last hour that needs to be shown because there is a period in it
      latestEndHour: endHour,
      // total number of days in this schedule
      numDays: (latestDay-earliestDay+1), // +1 because it includes the last day as a full day
      // first day that exists in the schedule
      startDay: earliestDay,
      // Percentage width of one day in the grid
      dayWidthPercentage: (100 * (1 / (latestDay - earliestDay + 1))),
      // Percentage height of one hour in the grid
      // hourHeightPercentage: (100 * (1 / (endHour - startHour)))
    };
  };

  // Iterate over the schedules received from the API and output an object containing
  // a list of converted template-ready schedule objects.
  var dataConvert = function(input) {
    var output = { schedules: [] };
    for(var i=0; i<input.schedules.length; ++i) {
      output.schedules.push(transformSchedule(input.schedules[i]));
    }
    return output;
  };

  // Change the displayed schedule, running the data through the template again.
  // Replaces #scheduleContent and the crn list and current schedule number.
  var showSchedule = function (index) {
    self.scheduleElement.innerHTML = HandlebarsTemplates.single_schedule(self.convertedData.schedules[index]);
    self.crnListElement.innerHTML = self.convertedData.schedules[index].crns;
    self.scheduleNumElement.innerHTML = index + 1;
  };

  // this is the beginning of the actual code to run when Yacs.views.schedule is called

  // convert all the schedules with transformSchedule
  self.convertedData = dataConvert(data);
  // render the overall page with its template
  Yacs.setContents(HandlebarsTemplates.schedule({
    totalSchedules: self.convertedData.schedules.length,
  }));
  // get links to permanent elements on the schedule page
  self.scheduleElement = document.getElementById('scheduleContainer');
  self.scheduleNumElement = document.getElementById('scheduleNum');
  self.crnListElement = document.getElementById('crnList');
  self.leftSwitchElement = document.getElementById('leftSwitch');
  self.rightSwitchElement = document.getElementById('rightSwitch');
  // bind event listeners to the left and right switches
  Yacs.on('click', self.leftSwitchElement, function () {
    self.scheduleIndex = (--self.scheduleIndex < 0 ? data.schedules.length - 1 : self.scheduleIndex);
    showSchedule(self.scheduleIndex);
  });
  Yacs.on('click', self.rightSwitchElement, function () {
    self.scheduleIndex = (++self.scheduleIndex < data.schedules.length ? self.scheduleIndex : 0);
    showSchedule(self.scheduleIndex);
  });
  // initialize scheduleIndex to 0 (first schedule)
  self.scheduleIndex = 0;
  // render the first schedule
  showSchedule(0);

};
