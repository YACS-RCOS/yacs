import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolListComponent } from '../school-list/component';
import { CourseListComponent } from '../course-list/component';
import { ScheduleViewComponent } from '../schedule-view/component';

const routes: Routes = [
  { path: '', redirectTo: '/schools', pathMatch: 'full' },
  { path: 'schools', component: SchoolListComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'schedules', component: ScheduleViewComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
    exports: [ RouterModule ]
})
export class AppRouterModule {}
