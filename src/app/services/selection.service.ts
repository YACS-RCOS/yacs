import { Injectable } from '@angular/core';

import { Section } from '../course-list/section/section';

@Injectable()
export class SelectionService {
  selectedSections : Section[] = [];

  public addSection(section : Section) {
    this.selectedSections.push(section);
    console.log(this.selectedSections);
  }

  public removeSection(section : Section) {
    let i = this.selectedSections.indexOf(section);
    if (i != -1) {
      this.selectedSections.splice(i, 1);
    }
  }

  public isSelected(section : Section) : boolean {
    return this.selectedSections.filter((s : Section) => {
      return s.id == section.id;
    }).length > 0;
  }
}
