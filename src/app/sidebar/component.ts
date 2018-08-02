import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { YacsService } from '../services/yacs.service';
import { Course } from '../models/course.model';
import { Section } from '../models/section.model';
import { Schedule} from '../models/schedule.model';
import { ScheduleEvent } from '../models/schedule-event.model';
import { SelectionService } from '../services/selection.service';
import { ScheduleComponent } from '../schedule-view/schedule/component';
import 'rxjs/Rx';
import {Subject, Subscription} from 'rxjs/Rx';
import * as domtoimage  from 'dom-to-image';


@Component({
  selector: 'sidebar',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class SidebarComponent implements OnInit{
	courses : Course[] = [];
	isLoaded : boolean = false;

  constructor (
    private yacsService : YacsService,
    private selectionService : SelectionService) { }

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

  ngOnInit () : void {
    this.getCourses();
  }
 }
