import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingViewComponent } from './component';
import { ListingModule } from '../listing/module';
import { NoResultsComponent } from '../no-results/component';

@NgModule({
  imports: [
    CommonModule,
    ListingModule
  ],
  declarations: [
    ListingViewComponent,
    NoResultsComponent
  ]
})
export class ListingViewModule { }
