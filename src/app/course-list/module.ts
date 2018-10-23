import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

import { CourseListComponent } from './component';
import { CourseComponent } from './course/component';
import { SectionComponent } from './section/component'; 

@NgModule({
  declarations: [
    CourseListComponent,
    CourseComponent,
    SectionComponent
  ],
  imports: [
    CommonModule,
    NgbModule
  ],
  exports: [
    CourseListComponent
  ]
})
export class CourseListModule { }
