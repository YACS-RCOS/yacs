/**
 * Courses view. Displays courses and their sections
 * @param {HTMLElement} target- The element in which this view should be rendered
 * @param {Object} params - API params for this view
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
    Yacs.on('click', target.querySelectorAll('section'), function (section) {
      Yacs.user.removeSelection(section.dataset.id) ||
        Yacs.user.addSelection(section.dataset.id,true);
    });

    Yacs.on('click', target.querySelectorAll('course-info'), function (courseInfo) {
      var courseSelected = courseInfo.parentElement.classList.contains('selected');
      if (courseSelected) {
        var sections = courseInfo.parentElement.querySelectorAll('section');
        Yacs.user.removeSelections(map(sections, function (section) {
          return section.dataset.id;
        }));
      } else {
        var sections = courseInfo.parentElement.querySelectorAll('section:not(.closed)');
        Yacs.user.addSelections(map(sections, function (section) {
          return section.dataset.id;
        }));
      }
    });
  };

  /**
   * Given the data returned from the API, populate the conflicts cache with
   * the data for conflicts.
   */
  var populateConflictsCache = function(data) {
    var courselen = data.courses.length;
    for(var i=0; i<courselen; ++i) {
      var sectlen = data.courses[i].sections.length;
      for(var j=0; j<sectlen; ++j) {
        var id = data.courses[i].sections[j].id;
        // TODO some method of cache expiration
        if(! (id in Yacs.cache.conflicts)) {
          Yacs.cache.conflicts[id] = data.courses[i].sections[j].conflicts;
        }
      }
    }
  }

  /** Given a section ID, the current selections, (and data in the conflicts cache),
   * return a boolean of whether this section has any conflicts with current selections.
   */
  var doesConflict = function(selections, sectid) {

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
          var hasConflict = doesConflict(section.dataset.id, selected);
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
      Yacs.render(target, 'courses', data);
      populateConflictsCache(data);
      // rendering will use tmp cache 'selections' field, clear this
      delete Yacs.cache.tmp.selections;
      Yacs.observe('selection', document.querySelector('courses'), updateSelected);
      bindListeners();
      updateSelected();
    }
  });
};
