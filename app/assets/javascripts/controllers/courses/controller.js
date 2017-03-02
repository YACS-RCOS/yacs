/**
 * Courses view. Displays courses and their sections
 * @param {HTMLElement} target- The element in which this view should be rendered
 * @param {Object} params - API params for this view
 * @return {undefined}
 * @memberOf Yacs.views
 */
'use strict';

Yacs.views.courses = function (target, params) {
  params['show_sections'] = params['show_periods'] = true;

  /**
   * When a section is clicked, toggle whether it is selected.
   * Uses Yacs.user for POT of selections
   * When a course is clicked, toggle its sections as selected.
   * Uses CSS for POT of selections
   */
  var bindListeners = function () {
    Yacs.on('click', target.querySelectorAll('section'), function (section) {
      if (!Yacs.user.removeSelection(section.dataset.id)) {
        Yacs.user.addSelection(section.dataset.id);
      }
    });

    Yacs.on('click', target.querySelectorAll('course-info'), function (courseInfo) {
      var courseSelected = courseInfo.parentElement.classList.contains('selected');
      var sections;
      if (courseSelected) {
        sections = courseInfo.parentElement.querySelectorAll('section');
        var sectionsToRemove = sections.map(function (section) {
          return section.dataset.id;
        });
        Yacs.user.removeSelections(sectionsToRemove);
      }
      else {
        sections = courseInfo.parentElement.querySelectorAll('section:not(.closed)');
        var sectionsToAdd = sections.map(function (section) {
          return section.dataset.id;
        });
        Yacs.user.addSelections(sectionsToAdd);
      }
    });
  };

  /**
   * Update selected status (class) of sections and courses. If all open
   * sections of a course are selected, the course is considered selected.
   */
  var updateSelected = function () {
    var selected = Yacs.user.getSelections();
    target.querySelectorAll('course').forEach(function (course) {
      var courseSelected = false;
      var sections = course.querySelectorAll('section');
      if (sections.length > 0) {
        courseSelected = true;
        sections.forEach(function (section) {
          var sectionSelected = selected.indexOf(section.dataset.id) !== -1;
          section.classList.toggle('selected', sectionSelected);
          if (!sectionSelected && !section.classList.contains('closed')) {
            courseSelected = false;
          }
        });
      }
      course.classList.toggle('selected', courseSelected);
    });
  };

  Yacs.models.courses.query(params, function (data, success) {
    if (success) {
      Yacs.render(target, 'courses', data);
      Yacs.observe('selection', document.querySelector('courses'), updateSelected);
      bindListeners();
      updateSelected();
    }
  });
};
