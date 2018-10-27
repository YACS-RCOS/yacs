import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseViewComponent } from './component';

import { CourseModule } from '../course/module';


@NgModule({
  imports: [
    CommonModule,
    CourseModule
  ],
  declarations: [
    CourseViewComponent
  ]
})
export class CourseViewModule { }
