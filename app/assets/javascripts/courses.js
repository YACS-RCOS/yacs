Handlebars.registerHelper('department_code', function (id) {
  return new Handlebars.SafeString(Yacs.models.departments.store.id[id].code);
});

Handlebars.registerHelper('course_credits', function (c) {
  var outString = '';
  // render "credit(s)" properly
  if(c.min_credits < c.max_credits) {
    outString = c.min_credits + '-' + c.max_credits + ' credits';
  }
  else {
    outString = c.max_credits + ' credit' + (c.max_credits === 1 ? 's' : '');
  }
  return new Handlebars.SafeString(outString);
});

Handlebars.registerHelper('join', function (arr) {
  return new Handlebars.SafeString(arr.join(', '));
});

Handlebars.registerHelper('course_seats', function (c) {
  var remaining = c.seats - c.seats_taken;
  return new Handlebars.SafeString(remaining);
});

/* Course setup code */
Yacs.views.courses = function (data) {
  var html = HandlebarsTemplates.courses(data);
  Yacs.setContents(html);

  var updateCourseSelected = function (course) {
    if (course.querySelector('section:not(.selected)')) {
      course.classList.remove('selected');
    } else {
      course.classList.add('selected');
    }
  }

  // Add event listeners to sections
  document.getElementsByTagName('section').each(function (s) {
    Yacs.on('click', s, function(sect) {
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
        sect.classList.add('selected');
      }
      updateCourseSelected(sect.closest('course'));
    });
  });

  document.getElementsByTagName('course').each(function (c) {
    Yacs.on('click', c.getElementsByTagName('course-info')[0], function (ci) {
      var selected = c.classList.contains('selected');
      c.getElementsByTagName('section').each(function (s) {
        if (selected) s.classList.remove('selected');
        else s.classList.add('selected')
      })
      if (selected) c.classList.remove('selected');
      else c.classList.add('selected')
    });
  })
};
