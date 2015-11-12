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
    replaceContent("home.html");
  });
  nsYacs.schedButton.addEventListener("click", function() {
    replaceContent("sampleSchedule.html");
  });
}

document.addEventListener("DOMContentLoaded", setup, false);
