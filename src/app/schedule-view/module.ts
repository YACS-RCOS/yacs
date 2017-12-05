import { NgModule } from '@angular/core';
// this is added so that an ngFor in the schools html will work.
import { CommonModule } from '@angular/common';
//import { RouterModule } from '@angular/router';

import { ScheduleViewComponent } from './component';
import { ScheduleComponent } from './schedule/component';
import { ScheduleEventComponent } from './schedule-event/component';
//import { SectionComponent } from '../course-list/section/component';

//import { YacsService } from '../services/yacs.service';

import { CourseListModule } from '../course-list/module';
//import { CourseComponent } from '../course-list/course/component';


@NgModule({
  declarations: [
    ScheduleViewComponent,
    ScheduleComponent,
    ScheduleEventComponent,
  ],
  imports: [
    CommonModule,
    CourseListModule
    //CourseComponent
    //RouterModule
  ],
  providers: [],
  //providers: [YacsService],
})

export class ScheduleViewModule {}
