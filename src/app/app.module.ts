import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRouterModule } from './app-router/module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/component';
import { NoticeBarComponent } from './notice-bar/component';
import { FooterComponent } from './footer/component';

import { SchoolViewModule } from './school-view/module';
import { CourseViewModule } from './course-view/module';
import { ScheduleViewModule } from './schedule-view/module';

import { ConstantsService } from './services/constants';
import { SelectionService } from './services/selection.service';
import { ConflictsService } from './services/conflicts.service';
import { NoticeService } from './services/notice.service';

import { AboutComponent } from './about/component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouterModule,
    SchoolViewModule,
    CourseViewModule,
    ScheduleViewModule
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    NoticeBarComponent,
    FooterComponent,
    AboutComponent
  ],
  providers: [
    ConstantsService,
    SelectionService,
    ConflictsService,
    NoticeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
