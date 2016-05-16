/* schedules.js - file for the code to handle everything with the schedule
   page */

/* Conversion function of military times to "minutes since midnight" format.
   THIS IS A TEMPORARY FUNCTION. When the backend part of Issue #102 is done,
   the times passed in the API will already be in this format. This function and
   any call to it should be deleted. */
function convertMilTime(milTime) {
  return Math.floor(milTime/100)*60 + (milTime % 100);
}

/* Given a single schedule JSON object as it is retrieved from the schedule API,
   return a new object that follows this structure:
   {
      startHour: int, // these are 24-hour hours so e.g. 15 is possible
      endHour: int,
      week: {
        Sunday: [
          // List of periods that will be sorted by their start field
          {
            start: int,
            end: int,
            deptCode: string,
            courseNum: string,
            sectNum: string,
            title: string,
            remaining: string,
            schedNum: int       // used to identify all sections of one course
          },
          {...},
          ...
        ],
        Monday: [
          {...}, ...
        ],
        ...
      }
   }
*/
function convertSchedToPeriods(data) {
  // Temporary variable that will hold the weekday lists.
  // This is so they can be referred to by index.
  var tmpweek = [[], [], [], [], [], [], []];

  var eStart = 23;
  var lEnd = 0;

  // identifies which section a period belongs to
  // (used to color all periods of a course the same color)
  var sectionCtr = 1;

  for (var s=0; s<data.sections.length; ++s) {
    var sect = data.sections[s];
    // assume the length of periods_start is the same as periods_end,
    // periods_type and periods_day. (else it's invalid)

    for (var i=0; i<sect.periods.length; ++i) {
      // the current period getting added into the structure
      var period = sect.periods[i];
      //period.prof = sect.instructors,
      // convert the times involved
      period.start = convertMilTime(period.start);
      period.end = convertMilTime(period.end);
      period.code      = sect.department_code;
      period.courseNum = sect.course_number;
      period.sectNum   = sect.name; // Should be a better term than "name"
	                            // but that's a problem with the API
      period.title     = sect.course_name;
      period.remaining = sect.seats - sect.seats_taken;
      period.schedNum  = sectionCtr;

      // add to the correct list
      tmpweek[period.day].push(period);

      // set eStart and lEnd properly
      var startHr = Math.floor(period.start/60);
      var endHr = Math.ceil(period.end/60);
      if(startHr < eStart) eStart = startHr;
      if(endHr > lEnd) lEnd = endHr;
    }

    // finished with section so increment the counter
    sectionCtr++;
  }

  // sort the periods in each day by start time
  for (var i = 0; i < tmpweek.length; i++) {
    tmpweek[i].sort(function(a,b) { return a.start < b.start; });
  }
  console.log(tmpweek);
}

Yacs.views.schedule = function(data) {
  /* data is directly from the API and is of the format
     { schedules: []}

  */
  // currently there are no other fields besides schedules so convert
  // directly down to the array
  var allSchedulesArray = data.schedules;
  if(allSchedulesArray.length < 1) {
    console.log('No schedules could be found. Perhaps there is a conflict?');
    return;
  }

  convertSchedToPeriods(allSchedulesArray[0]);
}
