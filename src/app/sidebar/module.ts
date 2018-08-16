import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from './component';
import { InterestedCoursesComponent } from './interested-courses/component';
import { NotificationsComponent } from './notifications/component';
import { CourseListModule } from '../course-list/module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardCourseComponent } from './interested-courses/clipboard-course/component';
import { ClipboardSectionComponent} from './interested-courses/clipboard-section/component';

@NgModule({
  declarations: [
    SidebarComponent,
    InterestedCoursesComponent,
    NotificationsComponent,
    ClipboardCourseComponent,
    ClipboardSectionComponent
  ],
  imports: [
    CommonModule,
    CourseListModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule { }