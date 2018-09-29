import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseViewComponent } from './component';

import { CourseListModule } from '../course-list/module';


@NgModule({
  imports: [
    CommonModule,
    CourseListModule
  ],
  declarations: [
    CourseViewComponent
  ]
})
export class CourseViewModule { }
