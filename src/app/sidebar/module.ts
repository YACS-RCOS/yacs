import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from './component';
import { InterestedCoursesComponent } from './interested-courses/component';
import { NotificationsComponent } from './notifications/component';
import { CourseListModule } from '../course-list/module';

@NgModule({
  declarations: [
    SidebarComponent,
    InterestedCoursesComponent,
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    CourseListModule,
    FormsModule
  ],
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule { }