import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListingDetailComponent } from './component';
import { ListingModule } from '../listing/module';

@NgModule({
  imports: [
    CommonModule,
    ListingModule
  ],
  declarations: [
    ListingDetailComponent
  ]
})
export class ListingDetailModule { }
