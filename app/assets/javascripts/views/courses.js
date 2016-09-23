Handlebars.registerHelper('department_code', function (id) {
  return new Handlebars.SafeString(Yacs.models.departments.store.id[id].code);
});

Handlebars.registerHelper('course_credits', function (c) {
  var outString = '';
  // render "credit(s)" properly
  if (c.min_credits != c.max_credits) {
    outString = c.min_credits + '-' + c.max_credits + ' credits';
  }
  else {
    outString = c.max_credits + ' credit' + (c.max_credits == 1 ? '' : 's');
  }
  return new Handlebars.SafeString(outString);
});

Handlebars.registerHelper('join', function (arr) {
  return new Handlebars.SafeString(arr.join(', '));
});

Handlebars.registerHelper('seats_available', function (s) {
  var remaining = s.seats - s.seats_taken;
  return new Handlebars.SafeString(remaining);
});

Handlebars.registerHelper('closed_status', function (s) {
  return new Handlebars.SafeString(s.seats > 0 && s.seats_taken >= s.seats ? 'closed' : '');
});

Handlebars.registerHelper('day_name', function (n) {
  return new Handlebars.SafeString(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][n]);
});

Handlebars.registerHelper('time_range', function (start, end) {
  return new Handlebars.SafeString([start, end].map(function (time) {
    var hour = Math.floor(time / 100);
    var ampm = hour >= 12 ? 'p' : 'a';
    hour = hour > 12 ? hour - 12 : hour == 0 ? 12 : hour;
    var minutes = time % 100;
    minutes = minutes > 9 ? minutes : minutes == 0 ? '' : '0' + minutes;
    return hour + (minutes ? ':' + minutes : '') + ampm;
  }).join('-'));
});

Handlebars.registerHelper('description_exists', function(description, options) {
   if(description.length > 0)
      return options.fn(this);
   else
      return options.inverse(this);
});

/**
 * Courses view. Displays courses and their sections
 * @param {Object} data - Object containing Courses model collection
 * @param {Model[]} data.courses - Courses model collection
 * @return {undefined}
 * @memberOf Yacs.views
 */
Yacs.views.courses = function (target, data) {
  var html = HandlebarsTemplates.courses(data);
  target.innerHTML = html;

  /**
   * Helper function to check if all open sections of a course are selected.
   * Used for toggling selection of an entire course.
   */
  var isCourseSelected = function (course) {
    var isSelected = true;
    course.querySelectorAll('section:not(.closed)').forEach(function (s) {
      if (!Yacs.user.hasSelection(s.dataset.id)) isSelected = false;
    });
    return isSelected;
  };

  /**
   * When a section is clicked, check the cookie to see if it is selected.
   * If it is selected, unselect it. If it is not selected, select it.
   */
  target.getElementsByTagName('section').forEach(function (s) {
    Yacs.on('click', s, function(section) {
      var sid = section.dataset.id;
      if (Yacs.user.removeSelection(sid)) {
        section.classList.remove('selected');
      }
      else {
        Yacs.user.addSelection(sid);
        section.classList.add('selected');
      }
      var course = section.closest('course');
      course.classList[isCourseSelected(course) ? 'add' : 'remove']('selected');
    });
    if (Yacs.user.hasSelection(s.dataset.id)) s.classList.add('selected');
  });

  /**
   * When a course is clicked, select all of its open sections if they are not
   * selected. If all open sections are selected, unselect them all.
   */
  target.getElementsByTagName('course').forEach(function (c) {
    Yacs.on('click', c.getElementsByTagName('course-info')[0], function (ci) {
      var isSelected = isCourseSelected(c);
      c.getElementsByTagName('section').forEach(function (s) {
        if (isSelected) {
          s.classList.remove('selected');
          Yacs.user.removeSelection(s.dataset.id);
        } else if (!s.classList.contains('closed')) {
          s.classList.add('selected');
          Yacs.user.addSelection(s.dataset.id);
        }
      });
      c.classList[isSelected ? 'remove' : 'add']('selected');
    });
    if (isCourseSelected(c)) c.classList.add('selected');
  });

  /**
   * Expand course descriptions when clicked.
   */
  target.getElementsByTagName('course-description').forEach(function(cd) {
    Yacs.on('click', cd, function(cd_, event_) {
      cd_.classList.add('expanded');
      event_.stopPropagation();
    });
  });
};
