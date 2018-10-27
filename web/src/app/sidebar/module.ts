import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from './component';
import { InterestedCoursesComponent } from './interested-courses/component';
import { NotificationsComponent } from './notifications/component';
import { CourseModule } from '../course/module';
import { CourseComponent } from '../course/component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    SidebarComponent,
    InterestedCoursesComponent,
    NotificationsComponent,
  ],
  imports: [
    CommonModule,
    CourseModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule { }
