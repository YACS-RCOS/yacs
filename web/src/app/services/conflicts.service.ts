import { Injectable } from '@angular/core';

import { SelectionService } from './selection.service';

@Injectable()
export class ConflictsService {

  private conflicts: any = {};

  constructor(private selectionService: SelectionService) { }

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
    let courses = data.courses || [];
    courses.forEach((course) => {
      let sections = course.sections || [];
      sections.forEach((section) => {
        let id = section.id;
        if (!this.conflicts[id]) {
          this.conflicts[id] = section.conflicts;
        }
      });
    });
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
    let selectionsFlat = [];
    let courseSelectionCounts = {};

    Object.keys(selections).forEach((cid) => {
      courseSelectionCounts[cid] = 0;
      selections[cid].forEach((sid) => {
        selectionsFlat.push([sid, cid]);
        courseSelectionCounts[cid]++;
      });
    });

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
    let flattenedSelections = this.flattenSelections(this.selectionService.getSelections()); // An object in the same format returned by flattenSelections.
    let selectionsFlat = flattenedSelections.selectionsFlat;
    let courseSelectionCounts = {};

    /* this decrements the numbers in course selection counts, so make a deep copy
     * of flattenedSelections.courseSelectionCount.
     */
    Object.keys(flattenedSelections.courseSelectionCounts).forEach((cid) => {
      courseSelectionCounts[cid] = flattenedSelections.courseSelectionCounts[cid];
    });

    if (!this.conflicts[sectId]) {
      // can't do anything, not going to ask the API for information
      return false;
    }

    // ASSUMPTIONS:
    // Section IDs in the flattened selections object and conflicts list are in increasing numeric order.
    // At least one of the arrays contains integer section IDs. This breaks if both are strings.

    let conflicts = this.conflicts[sectId];
    let i = 0;
    let j = 0;
    let imax = conflicts.length;
    let jmax = selectionsFlat.length;
    while (i < imax && j < jmax) {
      // remember, selectionsFlat contains Array[2]s containing a section id and a course id
      let selectedSectionId = selectionsFlat[j][0];
      let selectedCourseId = selectionsFlat[j][1];
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
