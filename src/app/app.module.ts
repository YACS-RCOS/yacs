import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRouterModule } from './app-router/module';
import { CookieService } from 'angular2-cookie';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/component';
import { FooterComponent } from './footer/component';

import { SchoolListModule } from './school-list/module';
import { CourseViewModule } from './course-view/module';
import { ScheduleViewModule } from './schedule-view/module';

import { ConstantsService } from './services/constants';
import { SelectionService } from './services/selection.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouterModule,
    SchoolListModule,
    CourseViewModule,
    ScheduleViewModule
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  providers: [
    CookieService,
    ConstantsService,
    SelectionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
