// yacs namespace
// contains application constants
const nsYacs = {
  deptColumnWidth : 600, // should be the same as the width
                         // defined for <school> in yacs-main.css
  deptColumnMargin : 10, // should be the same as side margins defined
                         // for <school> in yacs-main.css
  weekdayNames : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
		  'Friday', 'Saturday'],

  // IDs for the different pages
  homePage: 0, courselistPage: 1, schedulePage: 2
}

/* cookie helper functions
   based on W3C javascript cookie reference
   http://www.w3schools.com/js/js_cookies.asp */

function setCookie(name,value) {
  document.cookie = name+"="+value+"; path=/";
}

function getCookie(name) {
  name += "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return null;
}

// user namespace (holds user-specific data, in particular selected courses)
var nsUser = {
  /* We hold selected section IDs in a Javascript cookie in order to make them
     persist if the user navigates away from the page. These functions access
     and modify that cookie data. The section IDs are stored as a comma-
     separated list.
  */
  // Get the raw cookie string (useful for passing straight to schedules)
  getSelectionsRaw: function() {
    return getCookie('selections');
  },

  // Get the selections from the cookie as an array of strings
  getSelections: function() {
    var selections = getCookie('selections');
    return selections ? selections.split(',') : [];
  },

  // Add a selection to those already selected. Return the success value.
  addSelection: function(sid) {
    arr = this.getSelections();
    if (arr.indexOf(sid) != -1) return false;
    arr.push(sid);
    setCookie('selections', arr.join(','));
    return true;
  },

  // Remove a selection from the cookie. Return the success value.
  removeSelection: function(sid) {
    arr = this.getSelections();
    i = arr.indexOf(sid);
    if (i === -1) return false;
    arr.splice(i, 1);
    setCookie('selections', arr.join(','));
    return true;
  },

  // Determine whether the user has already selected a given section ID
  hasSelection: function(sid) {
    return this.getSelections().indexOf(sid) != -1;
  },

  currentPage: 0,
  currentSchedule: undefined,
}

/* Format some items which appear on the search results page into their final
   display. The API does not load text like "credits" or "Section"; the
   application is responsible for this process.
*/
function formatSearchResults() {
  // add "closed" class to sections with less than 1 seat
  var nodes = document.getElementsByTagName('section');
  for(var n of nodes) {
    var subnodes = n.getElementsByTagName('section-seats-available');
    // there should only be 1 <section-seats-available> child
    if(parseInt(subnodes[0].innerHTML, 10) < 1) {
      n.classList.add('closed');
    }
  }

  // add the actual "credit(s)" to credits elements, which only have the number
  nodes = document.getElementsByTagName('course-credits');
  for(var n of nodes) {
    var word = 'credits';
    if(parseInt(n.innerHTML, 10) === 1) { word = 'credit'; }
    n.innerHTML = n.innerHTML + ' ' + word;
  }

  // prepend the "Section" to section numbers
  nodes = document.getElementsByTagName('section-name');
  for(var n of nodes) {
    n.innerHTML = 'Section ' + n.innerHTML;
  }

  // append the " seats" to the available seats
  nodes = document.getElementsByTagName('section-seats-available');
  for(var n of nodes) {
    n.innerHTML += ' seats';
  }

  // period-day is represented as a number; translate it into a short day code
  nodes = document.getElementsByTagName('period-day');
  for(var n of nodes) {
    n.innerHTML = nsYacs.weekdayNames[parseInt(n.innerHTML, 10)].substring(0,3);
  }

  // for each period object, the period-start and period-end children are
  // represented in military time, so replace them with a period-time element
  // that formats them together as readable times
  nodes = document.getElementsByTagName('period');
  for(var n of nodes) {
    var ps = n.getElementsByTagName('period-start')[0];
    var pe = n.getElementsByTagName('period-end')[0];
    var startTime = milTimeToReadable(ps.innerHTML);
    var endTime = milTimeToReadable(pe.innerHTML);
    var pt = document.createElement('period-time');
    pt.innerHTML = startTime + '-' + endTime;
    ps.parentNode.insertBefore(pt, ps);
    ps.parentNode.removeChild(ps);
    pe.parentNode.removeChild(pe);
  }
}

/* Helper function to do the actual AJAX request. Takes a filename (same public
   XML document on the server) and a callback function which will get called
   with a single argument of the response text. 
   This will work with API documents, which should be on an root-relative path
   like "/api/v5/whatever.xml"
   Schedules get a JSON object. Using this will return it as text, which can
   then be parsed into JSON with JSON.parse().
   If this is being called in any "loader" function, make sure it's the last
   call in that function. Otherwise, any code after it can't assume that the
   code in the callback has finished.
*/
function doAjaxRequest(filename, callback) {
  var request = new XMLHttpRequest();
  request.addEventListener("load", function() {
    callback(request.response);
  });
  request.open("GET", filename, true); 
  request.send();
} 


// Clear the main div of any content and possibly put a loading indicator on
// the page.
function clearForNewPage() {
  // Using jQuery empty() is guaranteed to remove all event handlers that have
  // been applied to anything in the content. Without this, event handlers may
  // build up over time and slow down the page.
  $('div#content').empty();

  // can add in some code to set the inner HTML of the content container to some
  // default "Loading..." message or whatever here
  $('div#content').append('<img id="loading" src="loading.gif" />');
}

// Once the departments XML has been loaded into div#content, do any other steps
// needed to crunch it into presentable form.
function setupHomePage() {
  // When loading the home page, this must determine how many columns to
  // place the departments in, and then apply styling as needed to make them fit
  // into that many columns. Our approach is to always use the maximum possible
  // number of columns. The width of the output columns is always assumed to be
  // the maximum width of any school or department element.
  var numColumns =
    Math.floor($(document).width() /
  	       (nsYacs.deptColumnWidth + (nsYacs.deptColumnMargin * 2)));
  var schoolsFinalWidth = numColumns *
    (nsYacs.deptColumnWidth + (nsYacs.deptColumnMargin * 2));
  
  // This application does not know whether there are schools defined in the
  // database. If there are, the <schools> element will have a nonzero number of
  // children.
  var schoolsArray = $('schools').children();
  var numSchools = schoolsArray.length;
  
  if(numSchools === 0) {
    // schools are not defined
    $('schools').remove();
    if(numColumns > 1) {
      // height calculations are much simpler; all we have to do is find a
      // roughly equal number of departments per column. Still have to do <td>
      // wrapping though.
      var columnCtr = 0;
      var deptsPerColumn =
  	Math.ceil($('departments').children().length / numColumns);
      var appendLastTD = true;
      $('department').each(function(i, dept) {
  	if(columnCtr === 0) {
  	  $(dept).before('<td>');
  	}
  	columnCtr++;
  	if(columnCtr === deptsPerColumn) {
  	  $(dept).after('</td>');
  	  columnCtr = 0;
  	}
      });
      
      if(appendLastTD) {
  	$('departments').append('</td>');
      }
      $('departments').wrapInner('<table id="homeTable"><tr></tr></table>');
    }
  }
  else {
    // schools are defined
    if(numColumns > 1) {
      // need to calculate the "height" of each school, not in pixels, but in
      // some arbitrary unit of height independent of the styling.
      schoolHeights = [];
      $('school').each(function(i, obj) {
  	// school height = the number of <department> tags within its list plus
  	// 1 for the school heading (assumed to be around the same height as a
  	// department)
  	schoolHeights[i] =
  	  { 'height' : $(obj).find('department').length + 1,
  	    'data' : '<school>'+$(obj).html()+'</school>' };
      });
      // Order the schoolHeights array by height
      schoolHeights.sort(function(x,y) { return x.height < y.height });

      // I'm not implementing the full general solution to this problem (how
      // best to distribute elements of varying heights evenly in a number of
      // columns) at this time. The current algorithm is: put them in columns
      // 1, 2, ..., n; 1, 2, ..., n; and so on until all schools are gone.

      // Iterate over the <school>s and wrap each group of numColumns of them
      // in a td tag.
      var columnCtr = 0;
      var schoolsPerColumn = Math.ceil(numSchools / numColumns);
      var appendLastTD = true;
      if(numSchools / numColumns === 0) {
  	appendLastTD = false; // it will be appended by the loop
      }
      $('school').each(function(i, school) {
  	if(columnCtr === 0) {
  	  $(school).before('<td>');
  	}
  	columnCtr++;
  	if(columnCtr === schoolsPerColumn) {
  	  $(school).after('</td>');
  	  columnCtr = 0;
  	}
      });
      
      if(appendLastTD) {
  	$('schools').append('</td>');
      }
      $('schools').wrapInner('<table id="homeTable"><tr></tr></table>');
    }
  }
  // homeTable is either the child of departments or schools
  // they are unnecessary containers that get in the way, so remove them from
  // the DOM
  $('table#homeTable').unwrap();
  // page will not center unless homeTable is given a definite width
  $('table#homeTable').css('width', schoolsFinalWidth);
  
  // Add a click event listener to all departments to load that department's
  // courses from the API
  $('department').click(function() {
    var dept = $(this);
    nsYacs.searchbar.value = dept.children('department-code').html() + " ";
    loadCourses("/api/v5/courses.xml?department_id=" +
  		dept.children('department-id').html());
      
  });
}

// Anything that has to be done when loading up the front page.
function loadHomePage() {
  clearForNewPage();
  doAjaxRequest("/api/v5/departments.xml", function(response) {
    nsYacs.contentContainer.innerHTML = response;
    setupHomePage();
    nsUser.currentPage = nsYacs.homePage;
  });
}

// Once a courses XML has been loaded into div#content, do any other steps
// needed to crunch it into presentable form.
function setupCourses() {
  formatSearchResults();

  // mark any sections that are already in the selected array with .selected
  // class (used in revisiting pages)
  $('section').each(function(i, section) {
    var sid = $(section).find('section-id').html();
    if (nsUser.hasSelection(sid)) {
      $(this).addClass('selected');
    }
  });
  
  // bind section storing function to clicks
  $('section').click(function(event) {
    var sid = $(this).find('section-id').html();
    // care more about the data - so use that to determine how to change
    // the styling; i.e. if the id is in the array, we will always deselect it
    // regardless of whether it was being rendered as selected or not
    if(nsUser.removeSelection(sid)) {
      // index is real, section is selected, deselect it
      $(this).removeClass('selected');
    }
    else {
      // section is not selected, select it and add it to the array
      nsUser.addSelection(sid);
      $(this).addClass('selected');
    }
    // don't bubble up to the course click handler!
    event.stopPropagation();
  });
  
  // courses can also be clicked
  // if a course is clicked and all sections are selected, deselect all
  // sections. Otherwise, select all sections.
  $('course').click(function(event) {
    // we are guaranteed that the user clicked on the course and not a section
    var allSectionsSelected = true;
    var selections = nsUser.getSelections();
    $(this).find('section-id').each(function(i, sid) {
      alert(sid);
      // if a section id cannot be found in the selected array, they cannot
      // all be selected
      sid = $(sid).html();
      if(selections.indexOf(sid) < 0) {
  	   allSectionsSelected = false;
  	   return false; // break the .each() loop
      }
    });

    $(this).find('section').each(function(i, section) {
      var sid = $(section).find('section-id').html();
      if(allSectionsSelected) {
      	nsUser.removeSelection(sid);
      	$(section).removeClass('selected');
      }
      else {
	// never add closed sections
	if(! $(this).hasClass('closed')) {
      	  nsUser.addSelection(sid);
      	  $(section).addClass('selected');
	}
      }
    });
  });
}

// Anything that has to be done when loading up the courses/search results.
// The string argument is the literal API request that will be made, unchanged.
// If performing a search, you should call searchToQuery first.
function loadCourses(apiString) {
  clearForNewPage();
  doAjaxRequest(apiString, function(response) {
    nsYacs.contentContainer.innerHTML = response;
    setupCourses();
    nsUser.currentPage = nsYacs.courselistPage;
  });
}

/* Given a search string (what the user entered in the search bar), restructure
   it as a query string for the courses API.
   If anyone decides to implement a more intelligent search, the code for
   parsing things like "Tuesday class at 4" will go in here.
   The courses API expects a page request structured like
   /api/v5/courses?q=BIOL+1010+Hardwick. This is responsible for providing
   everything after the "q=".
   Possible improvement: let users quote multiword strings
*/
function searchToQuery(searchString) {
  var searchTerms = searchString.split(" ");
  var query = "";
  var first = true;
  for(var i=0; i<searchTerms.length; i++) {
    var term = searchTerms[i];
    if(term.length != 0) { // ignore multiple spaces creating "" terms
      if(first) {
	first = false;
      } else {
	query += "+";
      }
      query += term;
    }
  }
  return query;
}

/* Function callbacks that activate when navigating between schedules. */
function movePrevSchedule() {
  if(nsUser.currentSchedule <= 0 ||
     nsUser.currentPage != nsYacs.schedulePage)
    return; // already at leftmost
  
  nsUser.currentSchedule--;
  
  $('div#scheduleTable').html(nsUser.schedHTMLData[nsUser.currentSchedule]);
  
  if(nsUser.currentSchedule === 0) {
    $('#leftswitch').addClass('disabled');
  }
  $('#rightswitch').removeClass('disabled');
  // change number of the schedule
  $('#schedNum').html(nsUser.currentSchedule + 1);
}
function moveNextSchedule() {
  if(nsUser.currentSchedule >= nsUser.schedHTMLData.length-1 ||
     nsUser.currentPage != nsYacs.schedulePage)
    return; // already at rightmost
  
  nsUser.currentSchedule++;
  
  $('div#scheduleTable').html(nsUser.schedHTMLData[nsUser.currentSchedule]);

  if(nsUser.currentSchedule === nsUser.schedHTMLData.length - 1) {
    $('#rightswitch').addClass('disabled');
  }
  $('#leftswitch').removeClass('disabled');
  $('#schedNum').html(nsUser.currentSchedule + 1);
}

/* Schedule loading function
   Takes the selected courses from the cookie and passes them to the schedule
   API. Using the JSON data it receives, convert each schedule to periods
   and then to HTML, store those HTML schedules in nsUser, and load the first
   one into the DOM.
*/
function loadSchedules() {
  selectionsRaw = nsUser.getSelectionsRaw();
  // If nothing is selected, take no action
  // We could make it show "No courses selected" or whatever but I don't think
  // that's really necessary
  if (selectionsRaw.length < 1) return;

  clearForNewPage();
  
  // Construct the API request string that will be passed
  // expects a comma-delimited list of numeric section IDs
  var schedURL = "/api/v5/schedules.json?section_ids=" + selectionsRaw;
  
  // Get the schedules as a JSON object.
  doAjaxRequest(schedURL, function(response) {
    var allSchedulesArray = (JSON.parse(response)).schedules;
    var numSchedules = allSchedulesArray.length;
    
    // Test for no schedules
    if(numSchedules === 0) {
      $('div#content').html('<div class="error">No schedules are available for this selection of courses.</div>');
      return;
    }
    
    // Store the data in nsUser
    nsUser.schedHTMLData = [];
    for(var i=0; i<numSchedules; ++i) {
      nsUser.schedHTMLData[i] =
	convertPeriodsToHTML(convertSchedToPeriods(allSchedulesArray[i]));
    }
    nsUser.currentSchedule = 0;
    
    var disableSecond = (numSchedules === 1);
    var schedBar = '<div id="schedulebar"><span id="leftswitch" class="scheduleswitch disabled">&#9664;</span>Schedule <span id="schedNum">1</span> / ' +
      numSchedules +
      '<span id="rightswitch" class="scheduleswitch' +
      (numSchedules === 1 ? ' disabled' : '') +
      '">&#9654;</span></div>';
    
    $('div#content').html(schedBar + '<div id="scheduleTable">' + nsUser.schedHTMLData[0] + '</div>');

    // add event listeners to leftswitch and rightswitch
    $('#leftswitch').click(movePrevSchedule);
    $('#rightswitch').click(moveNextSchedule);

    nsUser.currentPage = nsYacs.schedulePage;
  });
}


/* Helper function to return the next multiple of 30 minutes
   If the given time is already a multiple of 30 minutes, return it. */
function next30Min(time) {
  if(time % 30 === 0) return time;
  return (time + 30 - (time % 30));
}


/* Helper function .......
   currently converts from miltime to number of minutes since midnight in addition to rounding to nearest 5 min, this may change (TODO) */
function roundTo5Min(milTime) {
  var min = Math.floor(milTime/100)*60 + (milTime % 100);
  return Math.round(min/5)*5;
}


/* Helper function to calculate the height in pixels of the difference between
   two times.
   Each minute is 0.8 pixels, plus 1 pixel for every 30-minute interval which
   is fully spanned by the given times (start is before it and end is after it.)
*/
function getHeight(startTime, endTime) {
  var timeDiff = endTime-startTime;
  var intervals = Math.floor((timeDiff)/30);
  var remainderTime = startTime+(intervals*30);
  var nextInterval = next30Min(remainderTime);
  if(nextInterval < endTime) {
    intervals++;
  }
  if(startTime % 30 === 0)
    intervals--; // exact 30min start/end times correction
  return ((timeDiff*4)/5) + intervals; 
}


/* Given a JSON object representing a single schedule from the API,
   transform it into an array of ordered arrays of periods.
   The larger array has 7 elements and represents the week. Each sub-array
   should be a list of all periods in that day, arranged by their start times.
*/
function convertSchedToPeriods(schedData) {
  var week = [];
  // days must be initialized separately so they don't all refer to the same
  week[0] = []; week[1] = []; week[2] = []; week[3] = []; week[4] = [];
  week[5] = []; week[6] = [];

  // identifies which course a period belongs to
  // (used to color all periods of a course the same color)
  var courseCtr = 1; 

  for (var sect of schedData.sections) {
    // assume the length of periods_start is the same as periods_end,
    // periods_type and periods_day. (else it's invalid)
    
    for (var i=0; i<sect.periods.length; ++i) {
      // the current period getting added into the structure
      var period = sect.periods[i]; 
      //period.prof = sect.instructors,
      // convert the times involved
      period.start     = roundTo5Min(period.start);
      period.end       = roundTo5Min(period.end);
      period.code      = sect.department_code;
      period.courseNum = sect.course_number;
      period.sectNum   = sect.name; // Should be a better term than "name"
	                            // but that's a problem with the API
      period.title     = sect.course_name;
      period.remaining = sect.seats_available;
      period.schedNum  = courseCtr;
      
      // use a crude insertion sort based on start time (data set is small)
      /* If the API promises to sort the periods (by day and then by start
	 time), we can get rid of this frontend sort and simply append each
	 period to the end of its day array:
	 week[period.day].push(period);
	 13 lines down to 1! :O
      */
      var inserted = false;
      for(var j=0; j<week[period.day].length; ++j) {
	if(week[period.day][j].start > period.start) {
	  // insert it into week[period.day] before the jth element
	  week[period.day].splice(j, 0, period);
	  inserted = true;
	  break;
	}
      }
      if(!inserted) {
	// period is later than anything else, or list is empty
	week[period.day].push(period);
      }
    }
    courseCtr++;
  }
  return week;
}


/* Helper function to convert a military time into a hh:mm representation. Does
   not currently use AM or PM.
   Used in parsing period times when loading courses. */
function milTimeToReadable(miltime) {
  var hour = Math.floor(miltime/100);
  if(hour > 12) {
    hour -= 12;
  }
  if(hour == 0) {
    hour = 12;
  }
  var minute = miltime % 100;
  if (minute < 10) minute = '0'+minute;
  return hour + ':' + minute;
}


/* Helper function to convert a numerical hours quantity into a string.
   Input is a int that represents a 24-hour hour.
   Used to generate the left side of the schedule table. */
function hourRepresentation(hour) {
  var ampm = (Math.floor(hour/12) % 2 ? 'PM' : 'AM');
  var newhour = hour % 12;
  if (newhour === 0) newhour = 12;
  return newhour + ' ' + ampm;
}


/* Given the array of arrays of periods returned from convertSchedToPeriods,
   convert it into a HTML string which will represent it as a schedule. */
function convertPeriodsToHTML(week) {
  // make sure week is valid
  if(week.length != 7) {
    return false;
  }
  
  // get earliest start/latest end for the week (both in days and hours)
  var earliestStart = 2359;
  var latestEnd = 0;
  var earliestDayWithPeriod = undefined;
  var latestDayWithPeriod;
  for(var i=0; i<7; ++i) {
    var thisDay = week[i]; // current array of periods (within one day)
    if(thisDay.length > 0) {

      if(earliestDayWithPeriod === undefined)
	earliestDayWithPeriod = i;

      if(thisDay[0].start < earliestStart)
	earliestStart = thisDay[0].start;
      
      if(thisDay[thisDay.length-1].end > latestEnd)
	latestEnd = thisDay[thisDay.length-1].end;

      latestDayWithPeriod = i;
    }
  }
  // extend them to nearest hours on either side
  // perhaps change this to half-hours later (TODO)
  earliestStart = 60 * Math.floor(earliestStart/60);
  latestEnd = 60 * Math.ceil(latestEnd/60);

  // generate column of hours
  var hourColumn = '<ul class="narrowcol"><li class="heading"></li>';
  for(var i = earliestStart; i < latestEnd; i+=30) {
    if(i % 60 === 0) {
      hourColumn += '<li>'+hourRepresentation(i/60)+'</li>';
    }
    else {
      hourColumn += '<li></li>';
    }
  }
  hourColumn += '</ul>';

  var weekHTML = hourColumn;
  for(var i=earliestDayWithPeriod; i<=latestDayWithPeriod; ++i) {
    
    var columnHTML = '<ul><li class="heading">'+nsYacs.weekdayNames[i]+'</li>';
    
    if(week[i].length === 0) {
      for(var j = earliestStart; j < latestEnd; j += 30) {
	columnHTML+='<li></li>';
      }
      columnHTML+='</ul>';
    }
    else {
      /* Strategy:
	 fill in empty <li>s before a period (adjust the height of the first one
	 if the difference between currTime and the next 30 minutes is less than
	 30 minutes) and increment currTime by 30 minutes until the difference
	 between currTime and the period start time is less than 30 minutes.
	 
	 Then, if this difference is nonzero, add a spacer li (which will have
	 no bottom border) with a custom height to fill the space until the
	 course begins.
	 If the difference is zero, do nothing (all space will have been filled
	 by the empty <li>s).
	 
	 Then, add the <li> for the course, with all its text (maybe broken up
	 with <p> tags TODO). This will have a course class defined by the
	 "course" field of the period and a custom height in pixels calculated
	 by the following:
	 (Total time in minutes)*0.8 +
	 (Number of multiples of 30 minutes spanned)
	 
	 If the period ends on a multiple of 30 minutes, add the "end30" class to
	 it, which will give it a bottom border.

	 Set currTime to this period's end time.
      */
      
      var currTime = earliestStart;
      for(var period of week[i]) {

	// step 1: fill in empty <li>s before period (these get bottom borders)
	if(period.start - currTime >= 30) {
	  // first one may be different
	  var nextInterval = next30Min(currTime);
	  if(currTime != nextInterval) {
	    columnHTML +=
	    '<li style="height:'+getHeight(currTime, nextInterval)+'px"></li>';
	    currTime = nextInterval;
	  }
	  for(; period.start - currTime >= 30; currTime += 30) {
	    columnHTML += '<li></li>';
	  }
	}

	// step 2: add a spacer li (no border) if there is still a time gap
	if(period.start - currTime > 0) {
	  columnHTML += '<li class="spacer" style="height:' +
	    getHeight(currTime, period.start) + 'px"></li>';
	}

	// step 3: add the actual course
	var classes = 'course c' + period.schedNum;
	var courseHeight = getHeight(period.start, period.end);
	if(period.endTime % 30 === 0) {
	  classes += ' end30';
	}
	if(period.remaining < 1) {
	  classes += ' closed';
	}
	columnHTML += '<li class="' + classes + '" style="height:' +
	  courseHeight + 'px">' + getCourseText(period) + '</li>';

	// step 4: set currTime
	currTime = period.end;
      }
      // add extra empty <li> after the last course until latestEnd
      // basically step 1 except with endTime instead of period.start
      if(latestEnd - currTime >= 30) {
	// first one may be different
	var nextInterval = next30Min(currTime);
	if(currTime != nextInterval) {
	  columnHTML +=
	  '<li style="height:'+getHeight(currTime, nextInterval)+'px"></li>';
	  currTime = nextInterval;
	}
	for(; latestEnd - currTime >= 30; currTime += 30) {
	  columnHTML += '<li></li>';
	}
      }
      // then, if there's any time left between currTime and latestEnd:
      if(latestEnd - currTime > 0) {
	// less than 30 minutes between currTime and latestEnd
	columnHTML +=
	'<li style="height:'+getHeight(currTime, latestEnd)+'px"></li>';
      }
    }

    columnHTML += '</ul>';
    weekHTML += columnHTML;
  }
  return weekHTML;
}

/* Given a period, return the text that should display in its schedule box. */
function getCourseText(period) {
  // One line of text per 30 minutes in the class.
  var lines = Math.floor((period.end-period.start)/30);
  var basetext = period.code + '-' + period.courseNum + '-' + period.sectNum
    + ' ' + period.type;
    
  if(lines < 2) {
    // one line of text, make it count
    return basetext;
  }
  else {
    // TODO: truncate string according to the number of lines that can be used
    return '<p>'+basetext+'</p>'+'<p>'+period.title;
  }
}

/* Global key press callback. Handles any key pressed at any time on any page
   anywhere. */
function handleKeydown(event) {
  var c = event.keyCode;
  if( ((c == 37) || (c == 38)) &&
      (nsUser.currentPage == nsYacs.schedulePage) ) {
    // Up/Left
    movePrevSchedule();
  }
  else if ( ((c == 39) || (c == 40)) &&
	    (nsUser.currentPage == nsYacs.schedulePage) ) {
    // Right/Down
    moveNextSchedule();
  }
  else {
    // NOTE: The behavior focusing most key presses on the searchbar only
    // works because there is only one text input in the whole site. If
    // another is ever added, that behavior must be removed or modified.
    nsYacs.searchbar.focus();
  }
}


/* Setup function. Initializes all data that needs to be used by this script,
   and adds any necessary event listeners. */
function setupPage() {
  // Initialize all variables in the yacs namespace
  nsYacs.contentContainer = document.getElementById("content");
  nsYacs.homeButton = document.getElementById("page-title");
  nsYacs.schedButton = document.getElementById("schedule-btn");
  nsYacs.searchbar = document.getElementById("searchbar");

  // Add click event to the YACS button
  nsYacs.homeButton.addEventListener("click", loadHomePage);

  // Add click event to the schedule button
  nsYacs.schedButton.addEventListener("click", loadSchedules);
  
  // Add enter key listener to the searchbar
  nsYacs.searchbar.addEventListener("keyup", function(event) {
    if(event.keyCode === 13) {
      if(nsYacs.searchbar.value)
        loadCourses("/api/v5/courses.xml?search=" + nsYacs.searchbar.value);
      else
        loadHomePage();
    }
  });

  // General keydown event listener.
  // It goes here because global keyboard events should be bound to document,
  // and that only once.
  document.addEventListener("keydown", function(event) {
    handleKeydown(event);
  });
  
  // Load the default home page
  loadHomePage();
}

// Only actually run this when the page finishes loading
document.addEventListener("DOMContentLoaded", setupPage, false);
