/**
 * Courses view. Displays courses and their sections
 * @param {Object} data - Object containing Courses model collection
 * @param {Model[]} data.courses - Courses model collection
 * @return {undefined}
 * @memberOf Yacs.views
 */
Yacs.views.courses = function (target, params) {
  params.show_sections = params.show_periods = true;

  /**
   * When a section is clicked, toggle whether it is selected.
   * Uses Yacs.user for POT of selections
   * When a course is clicked, toggle its sections as selected.
   * Uses CSS for POT of selections
   */
  var bindListeners = function () {
    Yacs.on('click', 'section', function (section) {
      Yacs.user.removeSelection(section.dataset.id) ||
        Yacs.user.addSelection(section.dataset.id);
    });

    Yacs.on('click', 'course-info', function (courseInfo) {
      var sections = courseInfo.parentElement.querySelectorAll('section');
      var section_ids = map(sections, function (section) {
        return section.dataset.id;
      });
      if (courseInfo.parentElement.classList.contains('selected'))
        Yacs.user.removeSelections(section_ids);
      else
        Yacs.user.addSelections(section_ids);
    });
  };

  /**
   * Update selected status (class) of sections and courses. If all open
   * sections of a course are selected, the course is considered selected.
   */
  var updateSelected = function () {
    var selected = Yacs.user.getSelections();
    each(target.querySelectorAll('course'), function (course) {
      var courseSelected = false;
      var sections = course.querySelectorAll('section');
      if (sections.length > 0) {
        courseSelected = true;
        each(sections, function (section) {
          var sectionSelected = selected.indexOf(section.dataset.id) !== -1;
          section.classList.toggle('selected', sectionSelected);
          if (!sectionSelected && !section.classList.contains('closed'))
            courseSelected = false;
        });
      }
      course.classList.toggle('selected', courseSelected);
    });
  };

  Yacs.models.courses.query(params, function (data, success) {
    if (success) {
      target.innerHTML = HandlebarsTemplates.courses(data);
      Yacs.observe('selection', document.querySelector('courses'), updateSelected);
      bindListeners();
      updateSelected();
    }
  });
};

/**
 * View Helpers
 */

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
