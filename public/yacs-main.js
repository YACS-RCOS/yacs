// yacs namespace
var nsYacs = {}
// user namespace (holds user-specific data, in particular selected courses)
var nsUser = {
  // Array of section IDs the user selects. Allows selected courses to persist
  // across content changes in the page. When we build the schedule API, we
  // will be passing all the section IDs in the GET request.
  selectedSectionIDs : []
}

// Global constants are all set here to keep them in one place.
nsYacs.deptColumnWidth = 600; // should be the same as the width
                              // defined for <school> in yacs-main.css
nsYacs.deptColumnMargin = 10; // should be the same as side margins defined
                              // for <school> in yacs-main.css

/* Format some items which appear on the search results page into their final
   display. The API does not load text like "credits" or "Section"; the
   application is responsible for this process.
*/
function formatSearchResults() {
  $('course-credits').html(function(index, oldhtml) {
    if(oldhtml == '1') { return oldhtml + ' credit'; }
    else { return oldhtml + ' credits'; }
  });
  $('section-name').prepend('Section ');
  $('section-seats-available').append(' seats');
}

/* Given a filename which is a public XML document on the server, return the
   content of that document.
   This will work with API documents, which should be on an root-relative path
   like "/api/v5/whatever.xml"
   Schedules get a JSON object. Using this will return it as text, which can
   then be parsed into JSON with JSON.parse().
*/
function getAPIContent(filename) {
  var request = new XMLHttpRequest();
  var ret = '';
  request.addEventListener("load", function() {
    ret = request.response;
  });
  // I don't see a problem with forcing this request to be synchronous, because
  // it's loading the entire page content. Other things like formatting that
  // need to wait on this to work properly _should_ wait on it.
  // This is known to raise a jQuery warning that this (synchronous)
  // functionality is deprecated.
  request.open("GET", filename, false); 
  request.send();
  return ret;
}

// Given a filename which is a public XML document on the server,
// replace the interior of div#content with it
function replaceContent(filename) {
  // Using jQuery empty() is guaranteed to remove all event handlers that have
  // been applied to anything in the content. Without this, event handlers may
  // build up over time and slow down the program.
  $('div#content').empty();
  nsYacs.contentContainer.innerHTML = getAPIContent(filename);
}

// Anything that has to be done when loading up the front page.
function loadHomePage() {
  //replaceContent("/api/v5/departments.xml?use_schools=false");
  replaceContent("/api/v5/departments.xml");

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

  if(numSchools == 0) {
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
	if(columnCtr == 0) {
	  $(dept).before('<td>');
	}
	columnCtr++;
	if(columnCtr == deptsPerColumn) {
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
      if(numSchools / numColumns == 0) {
	appendLastTD = false; // it will be appended by the loop
      }
      $('school').each(function(i, school) {
	if(columnCtr == 0) {
	  $(school).before('<td>');
	}
	columnCtr++;
	if(columnCtr == schoolsPerColumn) {
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
    nsYacs.searchbar.value = dept.children('department-code').html();
    loadCourses("/api/v5/courses.xml?department_id=" +
		dept.children('department-id').html());
    
  });
}

// Anything that has to be done when loading up the courses/search results.
// The string argument is the literal API request that will be made, unchanged.
// If performing a search, you should call searchToQuery first.
function loadCourses(apiString) {
  replaceContent(apiString);
  formatSearchResults();

  // mark any sections that are already in the selected array with .selected
  // class (used in revisiting pages)
  $('section').each(function(i, section) {
    var index =
      nsUser.selectedSectionIDs.
      indexOf(parseInt($(section).find('section-id').html()));
    if (index > -1) {
      $(this).addClass('selected');
    }
  });
  
  // bind section storing function to clicks
  $('section').click(function(event) {
    var sid = parseInt($(this).find('section-id').html());
    var index = nsUser.selectedSectionIDs.indexOf(sid);
    // care more about the data - so use that to determine how to change
    // the styling; i.e. if the id is in the array, we will always deselect it
    // regardless of whether it was being rendered as selected or not
    if(index > -1) {
      // index is real, section is selected, deselect it
      $(this).removeClass('selected');
      nsUser.selectedSectionIDs.splice(index, 1);
    }
    else {
      // section is not selected, select it and add it to the array
      $(this).addClass('selected');
      nsUser.selectedSectionIDs.push(sid);
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

    $(this).find('section-id').each(function(i, sid) {
      // if a section id cannot be found in the selected array, they cannot
      // all be selected
      if(nsUser.selectedSectionIDs.indexOf(parseInt($(sid).html())) < 0) {
	allSectionsSelected = false;
	return false; // break the .each() loop
      }
    });

    $(this).find('section').each(function(i, section) {
      var sid = parseInt($(section).find('section-id').html());
      var index = nsUser.selectedSectionIDs.indexOf(sid);
      if(allSectionsSelected) {
	if(index > -1) {
	  nsUser.selectedSectionIDs.splice(index, 1);
	}
	$(section).removeClass('selected');
      }
      else {
	if(index < 0) {
	  nsUser.selectedSectionIDs.push(sid);
	}
	$(section).addClass('selected');
      }
    });
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
    if(term.length != 0) { // ignore double spaces creating "" terms
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

/* Schedule loading function; takes the selected section IDs, builds the API
   string out of them (all the scheduling logic is done on the backend), gets
   the JSON version of the schedules, and fills the table with them. */
function loadSchedules() {
  // If nothing is selected, take no action
  if (nsUser.selectedSectionIDs.length < 1) return;
  alert("AWK HELLO AWK");

  // Construct the API request string that will be passed
  var schedURL = "/api/v5/schedules.json?"
  for(var i=0; i<nsUser.selectedSectionIDs.length; ++i) {
    // NOTE: The & is necessary for multiple IDs stringing together.
    // We'll see if having an extra one at the end of the string is a problem.
    schedURL += "section_id[]="+nsUser.selectedSectionIDs[i]+"&";
  }
  alert("schedURL is "+schedURL);

  // Get the schedules as a JSON object.
  var schedulesData = JSON.parse(getAPIContent(schedURL));
  replaceContent(sampleCourses.html);
  
}

/* Setup function. Initializes all data that needs to be used by this script,
   and adds any necessary event listeners. */
function setup() {
  // Initialize all variables in the yacs namespace
  nsYacs.contentContainer = document.getElementById("content");
  nsYacs.homeButton = document.getElementById("page-title");
  nsYacs.schedButton = document.getElementById("schedule-btn");
  nsYacs.searchbar = document.getElementById("searchbar");

  // Add click event to the YACS button
  nsYacs.homeButton.addEventListener("click", loadHomePage);

  // Add click event to the schedule button
  nsYacs.schedButton.addEventListener("click", loadSchedules);

  //Add enter key listener to the searchbar
  nsYacs.searchbar.addEventListener("keyup", function(event) {
    if(event.keyCode == 13) {
      var searchURL = "/api/v5/courses.xml?q="+
	searchToQuery(nsYacs.searchbar.value);
      loadCourses(searchURL);
    }
  });
  
  // Load the default home page
  loadHomePage();

  // 
}

// Only actually run this when the page finishes loading
document.addEventListener("DOMContentLoaded", setup, false);
