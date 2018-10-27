import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

import { CourseComponent } from './component';
import { SectionComponent } from './section/component'; 

@NgModule({
  declarations: [
    CourseComponent,
    SectionComponent
  ],
  imports: [
    CommonModule,
    NgbModule
  ],
  exports: [
    CourseComponent
  ]
})
export class CourseModule { }
