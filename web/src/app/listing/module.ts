import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ListingComponent } from './component';
import { SectionComponent } from './section/component';

@NgModule({
  declarations: [
    ListingComponent,
    SectionComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule
  ],
  exports: [
    ListingComponent
  ]
})
export class ListingModule { }
