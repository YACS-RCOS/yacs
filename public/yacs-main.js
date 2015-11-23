// yacs namespace
var nsYacs = {}

function replaceContent(filename) {
  var request = new XMLHttpRequest();
  request.addEventListener("load", function() {
    nsYacs.contentContainer.innerHTML = request.response;
  });
  request.open("GET", filename);
  request.send();
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
  replaceContent("home.html");

  // Add click events to the YACS and schedule buttons
  nsYacs.homeButton.addEventListener("click", function() {
    replaceContent("/api/v5/departments.xml");
  });
  nsYacs.schedButton.addEventListener("click", function() {
    //replaceContent("/api/v5/courses.xml");
    replaceContent("sampleSchedule.html");
  });

  //Add enter key listener to the searchbar
  nsYacs.searchbar.addEventListener("keyup", function(event) {
    if(event.keyCode == 13) {
      alert("Your query is \""+nsYacs.searchbar.value+"\"");
    }
    replaceContent("sampleCourses.html");
  });
}

document.addEventListener("DOMContentLoaded", setup, false);
