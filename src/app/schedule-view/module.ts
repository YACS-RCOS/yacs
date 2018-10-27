import { NgModule } from '@angular/core';
// this is added so that an ngFor in the schools html will work.
import { CommonModule } from '@angular/common';
//import { RouterModule } from '@angular/router';

import { ScheduleViewComponent } from './component';
import { ScheduleComponent } from './schedule/component';
import { ScheduleEventComponent } from './schedule-event/component';
//import { SectionComponent } from '../course-list/section/component';

//import { YacsService } from '../services/yacs.service';

//import { CourseComponent } from '../course-list/course/component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    ScheduleViewComponent,
    ScheduleComponent,
    ScheduleEventComponent,
  ],
  imports: [
    NgbModule,
    CommonModule
  ],
  providers: [],
  //providers: [YacsService],
})

export class ScheduleViewModule {}
