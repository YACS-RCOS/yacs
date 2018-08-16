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

  constructor (
    private yacsService : YacsService,
    public selectionService : SelectionService)
    { }

  public getCourses () : void {
    const courseIds = this.selectionService.getSelectedCourseIds();
    if (courseIds.length > 0) {
      this.yacsService
        .get('courses', { id: courseIds.join(','), show_sections: true, show_periods: true })
        .then((data) => {
          this.courses = data['courses'] as Course[];
        });
    }
  }

  ngOnInit (){
    this.getCourses();
  }
 }