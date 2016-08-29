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
  return new Handlebars.SafeString(['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][n]);
});

Handlebars.registerHelper('time_range', function (start, end) {
  return new Handlebars.SafeString([start, end].map(function (time) {
    var hour = Math.floor(time / 100);
    var ampm = hour > 12 ? 'p' : 'a';
    hour = hour > 12 ? hour - 12 : hour == 0 ? 12 : hour;
    var minutes = time % 100;
    minutes = minutes > 9 ? minutes : minutes == 0 ? '' : '0' + minutes;
    return hour + (minutes ? ':' + minutes : '') + ampm;
  }).join('-'));
});


/**
 * Courses view. Displays courses and their sections
 * @param {Object} data - Object containing Courses model collection
 * @param {Model[]} data.courses - Courses model collection
 * @return {undefined}
 * @memberOf Yacs.views
 */
Yacs.views.courses = function (target, data) {
  target.innerHTML = HandlebarsTemplates.courses(data);

  var coursesElement = document.querySelector('courses');

  /**
   * Update selected status (class) of sections and courses. If all open
   * sections of a course are selected, the course is considered selected.
   */
  var updateSelected = function () {
    var selected = Yacs.user.getSelections();
    each(target.querySelectorAll('course'), function (course) {
      var courseSelected = true;
      each(course.querySelectorAll('section'), function (section) {
        var sectionSelected = selected.indexOf(section.dataset.id) !== -1;
        section.classList[sectionSelected ? 'add' : 'remove']('selected');
        if (!sectionSelected && !section.classList.contains('closed'))
          courseSelected = false;
      });
      course.classList[courseSelected ? 'add' : 'remove']('selected');
    });
  };

  /**
   * When a section is clicked, set it as selected
   */
  Yacs.on('click', 'section', function (section) {
    if (section.classList.contains('selected'))
      Yacs.user.removeSelection(section.dataset.id);
    else
      Yacs.user.addSelection(section.dataset.id);
  });

  /**
   * When a course is clicked, toggle its sections as selected
   */
  Yacs.on('click', 'course-info', function (courseInfo) {
    var sections = courseInfo.parentElement.querySelectorAll('section');
    var section_ids = [];
    sections = sections.forEach(function (section) {
      section_ids.push(section.dataset.id);
    });
    if (courseInfo.parentElement.classList.contains('selected'))
      Yacs.user.removeSelections(section_ids);
    else
      Yacs.user.addSelections(section_ids);
  });

  Yacs.observe('selection', coursesElement, updateSelected);

  updateSelected();
};
