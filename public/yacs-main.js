// yacs namespace
var nsYacs = {}

/* Given a filename which is a public XML document on the server,
   replace the interior of div#content with it. Styling should be done
   automatically.
   This will work with API documents, which should be on an root-relative path
   like "/api/v5/whatever.xml"
*/
function replaceContent(filename) {
  var request = new XMLHttpRequest();
  request.addEventListener("load", function() {
    nsYacs.contentContainer.innerHTML = request.response;
  });
  request.open("GET", filename);
  request.send();
}

/* Given a search string (what the user entered in the search bar), restructure
   it as a query string for the courses API.
   When we get around to having a more intelligent search, the code for parsing
   things like "Tuesday class at 4" will go in here.
   The courses API expects a page request structured like
   /api/v5/courses?q=BIOL+1010+Hardwick. This is responsible for providing
   everything after the "q=".
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

/* Setup function. Initializes all data that needs to be used by this script,
   and adds any necessary event listeners. */
function setup() {
  // Initialize all variables in the yacs namespace
  nsYacs.contentContainer = document.getElementById("content");
  nsYacs.homeButton = document.getElementById("page-title");
  nsYacs.schedButton = document.getElementById("schedule-btn");
  nsYacs.searchbar = document.getElementById("searchbar");
  
  // Load the default home page 
  replaceContent("/api/v5/departments.xml");

  // Add click events to the YACS and schedule buttons
  nsYacs.homeButton.addEventListener("click", function() {
    replaceContent("/api/v5/departments.xml");
  });
  nsYacs.schedButton.addEventListener("click", function() {
    // MUST BE REPLACED WITH REAL SCHEDULE API REQUEST
    replaceContent("sampleSchedule.html");
  });

  //Add enter key listener to the searchbar
  nsYacs.searchbar.addEventListener("keyup", function(event) {
    if(event.keyCode == 13) {
      var searchURL = "/api/v5/courses.xml?q="+
	searchToQuery(nsYacs.searchbar.value);
      replaceContent(searchURL);
    }
  });
}

document.addEventListener("DOMContentLoaded", setup, false);
