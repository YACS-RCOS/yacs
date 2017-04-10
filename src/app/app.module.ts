import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRouterModule } from './app-router/module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/component';
import { FooterComponent } from './footer/component';

import { SchoolListModule } from './school-list/module';
import { CourseListModule } from './course-list/module';
import { ScheduleViewModule } from './schedule-view/module';

import { ConstantsService } from './services/constants';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouterModule,
    SchoolListModule,
    CourseListModule,
    ScheduleViewModule
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  providers: [
    ConstantsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
