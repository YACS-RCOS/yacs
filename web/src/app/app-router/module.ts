import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolViewComponent } from '../school-view/component';
import { ListingViewComponent } from '../listing-view/component';
import { ListingDetailComponent } from '../listing-detail/component';
import { ScheduleViewComponent } from '../schedule-view/component';
import { AboutComponent } from '../about/component';
import { NoResultsComponent } from '../no-results/component';

const routes: Routes = [
  { path: '', redirectTo: '/schools', pathMatch: 'full' },
  { path: 'schools', component: SchoolViewComponent },
  { path: 'courses', component: ListingViewComponent },
  { path: 'courses/:id', component: ListingDetailComponent },
  { path: 'schedules', component: ScheduleViewComponent },
  { path: 'about', component: AboutComponent},
  { path: 'no-results', component: NoResultsComponent},
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
    exports: [ RouterModule ]
})
export class AppRouterModule {}
