import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingViewComponent } from './component';
import { ListingModule } from '../listing/module';

@NgModule({
  imports: [
    CommonModule,
    ListingModule
  ],
  declarations: [
    ListingViewComponent
  ]
})
export class ListingViewModule { }
