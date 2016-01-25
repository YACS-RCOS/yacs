// cookie helper functions
function setCookie(name,value) {
  document.cookie = name+"="+value+"; path=/";
}

function getCookie(name) {
  name += "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return null;
}

// yacs namespace
var nsYacs = {}

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
    if (i == -1) return false;
    arr.splice(i, 1);
    setCookie('selections', arr.join(','));
    return true;
  },

  // Determine whether the user has already selected a given section ID
  hasSelection: function(sid) {
    return this.getSelections().indexOf(sid) != -1;
  }
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

// Anything that has to be done when loading up the front page.
function loadHomePage() {
  clearForNewPage();
  doAjaxRequest("/api/v5/departments.xml", function(response) {
    nsYacs.contentContainer.innerHTML = response;
    setupHomePage();
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
      	nsUser.addSelection(sid);
      	$(section).addClass('selected');
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

/* Schedule loading function; takes the selected section IDs, builds the API
   string out of them (all the scheduling logic is done on the backend), gets
   the JSON version of the schedules, then calls setupSchedules to format the
   page.
*/
function loadSchedules() {
  // If nothing is selected, take no action
  selectionsRaw = nsUser.getSelectionsRaw();
  if (selectionsRaw.length < 1) return;

  clearForNewPage();

  // Construct the API request string that will be passed
  // expects a comma-delimited list of numeric section IDs
  var schedURL = "/api/v5/schedules.json?section_ids=" + selectionsRaw;

  // Get the schedules as a JSON object.
  doAjaxRequest(schedURL, function(response) {
    var schedulesData = JSON.parse(response);
    setupSchedules(schedulesData);
  });
}

/* Given an empty div#content and a JSON object representing all possible
   schedules, create the schedules page with that data. */
function setupSchedules(schedData) {
  
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
      alert(searchURL);
      loadCourses(searchURL);
    }
  });
  
  // Load the default home page
  loadHomePage();

  // 
}

// Only actually run this when the page finishes loading
document.addEventListener("DOMContentLoaded", setup, false);
