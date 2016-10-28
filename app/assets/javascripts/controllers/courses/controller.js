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
   * When a section is clicked, toggle its individual selection status.
   * When a course is clicked, toggle its sections as selected.
   * Uses Yacs.user as the point of truth for selections
   */
  var bindListeners = function () {
    Yacs.on('click', target.querySelectorAll('section'), function (section) {
      var sid = section.dataset.id;
      var cid = section.dataset.courseId;
      if(! Yacs.user.removeSelection(section.dataset.id)) {
        // remove failed so add instead
        Yacs.user.addSelection(section.dataset.id,true);
      }
    });

    Yacs.on('click', target.querySelectorAll('course-info'), function (courseInfo) {
      var cid = courseInfo.parentElement.dataset.id;
      if (Yacs.user.courseIsSelected(cid)) {
        Yacs.user.removeCourse(cid);
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

  /**
   * Flatten the selection data into an array of arrays [sectionId, courseId]
   * sorted by section id. Also generate a map of course ids to the number of
   * sections that are selected by that course.
   * This is a preprocessing step for evaluating conflicts on each section
   * efficiently (in O(k + s) time) without having to refer back to the selections
   * in their normal format.
   * Return an object containing the flattened array and the course id map.
   */
  var flattenSelections = function(selections) {
    selectionsFlat = []
    courseSelectionCounts = {}

    for(var cid in selections) {
      courseSelectionCounts[cid] = 0;
      var sidlen = selections[cid].length;

      for(var i=0; i<sidlen; ++i) {
        var sid = selections[cid][i];
        selectionsFlat.push([sid, cid]);
        courseSelectionCounts[cid]++;
      }

    }
    // then sort selectionsFlat by ascending order of sid
    // this could be improved with an optimized k-merge of the sectionId arrays, TODO
    selectionsFlat.sort(function(sidcid1, sidcid2) {
      // the arguments are those 2-element arrays [sid, cid] from above
      return sidcid1[0] - sidcid2[0];
    });
    return {
      'selectionsFlat': selectionsFlat,
      'courseSelectionCounts': courseSelectionCounts,
    };
  };

  /** Given a section ID, the course ID of the course the section is associated with,
   * the values returned from flattenSelections, (and data in the conflicts cache),
   * return a boolean of whether this section has any conflicts with current selections.
   */
  var doesConflict = function(sectId, courseId, selectionsFlat, courseSelectionCounts) {
    if(! (courseId in Yacs.cache.conflicts)) {
      // can't do anything, not going to ask the API for information
      return false;
    }
    // ASSUMPTIONS:
    // Section IDs in the flattened selections object and conflicts list are in increasing numeric order.
    // At least one of the arrays contains integer section IDs. This breaks if both are strings.

    var conflicts = Yacs.cache.conflicts[sectId];
    var i=0, j=0;
    var imax = conflicts.length, jmax = selectionsFlat.length;
    while(i < imax && j < jmax) {
      // remember, selectionsFlat contains Array[2]s containing a section id and a course id
      var selectedSectionId = selectionsFlat[j][0];
      var selectedCourseId = selectionsFlat[j][1];
      if(conflicts[i] < selectedSectionId)
        ++i;
      else if(conflicts[i] > selectedSectionId)
        ++j;
      else if(conflicts[i] == selectedSectionId) {
        --courseSelectionCounts[selectedCourseId];
        if(courseSelectionCounts[selectedCourseId] < 1) {
          // all sections for a single selected course conflict with this section
          // the function does not need to go any further
          return true;
        }
        ++i;
        ++j;
      }
    }
    // if here, either the conflict array or the flat selections array has been exhausted
    return false;

    /*
    for(var cid in selections) {
      var i=0, j=0;
      var imax = selections[cid].length, jmax = conflicts.length;
      var available_sections = imax;
      while(i<imax && j < jmax) {
        if(selections[cid][i] < conflicts[j]) {
          ++i;
        }
        else if(selections[cid][i] > conflicts[j]) {
          ++j;
        }
        else if(selections[cid][i] == conflicts[j]) {
          ++i;
          ++j;
          --available_sections;
        }
        else {
          // nan or some other bad comparison
          // will infinite loop
        }
      }
      if(available_sections < 1) {
        // every selected section for this course conflicts with this section
        // therefore this section "conflicts with selected courses"
        return true;
      }
    }
    */
  };

  /**
   * Make a deep copy of the courseSelectionCounts object and return it.
   */
  var copyCounts = function(courseSelectionCounts) {
    var output = {};
    for(var key in courseSelectionCounts) {
      output[key] = courseSelectionCounts[key];
    }
    return output;
  };

  /**
   * Update selected status (class) of sections and courses. If all open
   * sections of a course are selected, the course is considered selected.
   */
  var updateSelected = function () {
    // It would be a good idea for conflicts to optimize by checking only the course that
    // actually updated. Actually, why doesn't this already do that?
    var selected = Yacs.user.getSelections();
    flatObj = flattenSelections(selected);

    each(target.querySelectorAll('course'), function (course) {
      var courseSelected = false;
      var sections = course.querySelectorAll('section');
      if (sections.length > 0) {
        courseSelected = true;
        each(sections, function (section) {
          // TODO optimize this next line somehow
          var sectionSelected = Yacs.user.hasSelection(section.dataset.id, course.dataset.id);
          section.classList.toggle('selected', sectionSelected);

          // doesConflict modifies the data courseSelectionCounts passed into it, so do a deep copy of it
          var hasConflict = doesConflict(section.dataset.id, selected, flatObj.selectionsFlat, copyCounts(flatObj.courseSelectionCounts));
          section.classList.toggle('conflicts', hasConflict);

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
      Yacs.observe('selection', document.querySelector('courses'), updateSelected);
      bindListeners();
      updateSelected();
    }
  });
};
