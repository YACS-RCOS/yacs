import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { YacsService } from '../../services/yacs.service';
import { SelectionService } from '../../services/selection.service';
import { Course } from '../../models/course.model';
import 'rxjs/Rx';
import {Subject, Subscription} from 'rxjs/Rx';
import * as domtoimage  from 'dom-to-image';

@Component({
  selector: 'interested-courses',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class InterestedCoursesComponent implements OnInit {

  courses : Course[] = [];
  isLoaded : boolean = false;
  private courseIds : Set<string>;
  private subscription;

  constructor (
      private yacsService : YacsService,
      public selectionService : SelectionService) {
    this.subscription = this.selectionService.subscribe(() => {
      this.getCourses();
    });
  }

  ngOnInit () {
    this.courseIds = new Set<string>();
    this.getCourses();
  }

  public getCourses () : void {
    this.selectionService.getSelectedCourseIds().forEach(this.courseIds.add, this.courseIds);

    if (this.courseIds.size > 0) {
      this.yacsService
        .get('courses', { id: Array.from(this.courseIds).join(','), show_sections: true, show_periods: true })
        .then((data) => {
          this.courses = data['courses'] as Course[];
        });
    }
  }
}
