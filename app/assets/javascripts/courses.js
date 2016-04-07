Handlebars.registerHelper('department_code', function (id) {
  return new Handlebars.SafeString(Yacs.models.departments.store.id[id].code);
});

Handlebars.registerHelper('course_credits', function (c) {
  var outString = '';
  // render "credit(s)" properly
  if(c.min < c.max) {
    outString = c.min + '-' + c.max + ' credits';
  }
  else {
    outString = c.max + ' credit' + (c.max === 1 ? 's' : '');
  }
  return new Handlebars.SafeString(outString);
});

Handlebars.registerHelper('join', function (arr) {
  return new Handlebars.SafeString(arr.join(', '));
});

Handlebars.registerHelper('course_seats', function (c) {
  var seats = c.seats - c.seats_taken;
  return new Handlebars.SafeString(seats + (seats == 1 ? ' seat' : ' seats'));
});

/* Course setup code */
Yacs.views.courses = function (data) {
  var html = HandlebarsTemplates.courses(data);
  document.getElementById('content').innerHTML = html;

  // Add event listeners to sections
  var nodes = document.getElementsByTagName('section');
  for(var i=0; i<nodes.length; ++i) {
    Yacs.addEventListener('click', nodes[i], function(sect) {
      /* If there happens to be a mismatch between the data and the display,
         we care about the data - e.g. if the id is in the array, we will
         always deselect it regardless of whether it was being rendered as
         selected or not.
      */
      
      var sid = sect.dataset.id;
      if(Yacs.user.removeSelection(sid)) {
        // index is real, section is selected, remove selected class
        sect.classList.remove('selected');
      }
      else {
        // section is not selected, select it and add it to the array
        Yacs.user.addSelection(sid);
        sect.className += ' selected';
      }
    });
  }
};
