import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolViewComponent } from '../school-view/component';
import { CourseViewComponent } from '../course-view/component';
import { ScheduleViewComponent } from '../schedule-view/component';
import { AboutComponent } from '../about/component';
import { NoticeBarComponent } from '../notice-bar/component';

const routes: Routes = [
  { path: '', redirectTo: '/schools', pathMatch: 'full' },
  { path: 'schools', component: SchoolViewComponent },
  { path: 'courses', component: CourseViewComponent },
  { path: 'schedules', component: ScheduleViewComponent },
  { path: 'about', component: AboutComponent},
  //in for testing
  { path: 'noticebar', component: NoticeBarComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
    exports: [ RouterModule ]
})
export class AppRouterModule {}
