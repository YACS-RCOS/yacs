import { Injectable } from '@angular/core';

@Injectable()
export class ConflictsService {

  private conflicts: any = {};

  /**
   * Given the data returned from the API, populate the conflicts cache with
   * the data for conflicts.
   * @param {Object} data - The verbatim JSON object returned from the courses API.
   */
  public populateConflictsCache(data) {
    /* NOTE: The data in the conflicts cache MUST be sorted by section ID.
     * Currently we are assuming the conflicts in the API will always be sorted.
     * If that is not the case, a sort must be implemented here.
     */
    var courselen = data.courses.length;
    for (var i = 0; i < courselen; ++i) {
      var sectlen = data.courses[i].sections.length;
      for (var j = 0; j < sectlen; ++j) {
        var id = data.courses[i].sections[j].id;

        // TODO some method of cache expiration
        if (!(id in this.conflicts)) {
          this.conflicts[id] = data.courses[i].sections[j].conflicts;
        }
      }
    }
  };

  /**
   * Flatten the selection data into an array of arrays [sectionId, courseId]
   * sorted by section id. Also generate a map of course ids to the number of
   * sections that are selected by that course.
   * This is a preprocessing step for evaluating conflicts on each section
   * efficiently (in O(k + s) time) without having to refer back to the selections
   * in their normal format.
   * Return an object containing the flattened array and the course id map.
   * @param {Object} selections - The selections object returned verbatim from Yacs.user.getSelections().
   * @return {Object} The selection data converted into an array of 2-element arrays, each with a section id and its associated course id, and a map of each course ID to its number of selected sections.
   */
  public flattenSelections(selections) {
    var selectionsFlat = [];
    var courseSelectionCounts = {};

    for (var cid in selections) {
      courseSelectionCounts[cid] = 0;
      var sidlen = selections[cid].length;

      for (var i = 0; i < sidlen; ++i) {
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
      'courseSelectionCounts': courseSelectionCounts
    };
  }

  /** Given a section ID, the output of flattenSelections,
   * (and data in the conflicts cache),
   * return a boolean of whether this section has any conflicts with
   * current selections.
   * @param {int} sectId - Section ID to check for conflicts.
   * @return {boolean} Whether this section conflicts with currently selected sections.
   */
  public doesConflict(sectId: number) {
    let flattenedSelections = this.flattenSelections(JSON.parse(localStorage.getItem('selections'))); // An object in the same format returned by flattenSelections.
    var selectionsFlat = flattenedSelections.selectionsFlat;
    var courseSelectionCounts = {};

    /* this decrements the numbers in course selection counts, so make a deep copy
     * of flattenedSelections.courseSelectionCount.
     */
    for (var key in flattenedSelections.courseSelectionCounts) {
      courseSelectionCounts[key] = flattenedSelections.courseSelectionCounts[key];
    }

    if (!(sectId in this.conflicts)) {
      // can't do anything, not going to ask the API for information
      return false;
    }

    // ASSUMPTIONS:
    // Section IDs in the flattened selections object and conflicts list are in increasing numeric order.
    // At least one of the arrays contains integer section IDs. This breaks if both are strings.

    var conflicts = this.conflicts[sectId];
    var i = 0;
    var j = 0;
    var imax = conflicts.length;
    var jmax = selectionsFlat.length;
    while (i < imax && j < jmax) {
      // remember, selectionsFlat contains Array[2]s containing a section id and a course id
      var selectedSectionId = selectionsFlat[j][0];
      var selectedCourseId = selectionsFlat[j][1];
      if (conflicts[i] < selectedSectionId) {
        ++i;
      }
      else if (conflicts[i] > selectedSectionId) {
        ++j;
      }
      else if (conflicts[i] === selectedSectionId) {
        --courseSelectionCounts[selectedCourseId];
        if (courseSelectionCounts[selectedCourseId] < 1) {
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
  };
}
