import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolsComponent } from './schools.component';
import { CourseListComponent } from './courselist.component';

const routes: Routes = [
    { path: '', redirectTo: '/schools', pathMatch: 'full' },
    { path: 'schools', component: SchoolsComponent },
    { path: 'courses', component: CourseListComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
    exports: [ RouterModule ]
})
export class AppRouterModule {}
