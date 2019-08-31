import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListingDetailComponent } from './component';
import { ListingModule } from '../listing/module';

@NgModule({
  imports: [
    CommonModule,
    ListingModule,
    FormsModule
  ],
  declarations: [
    ListingDetailComponent
  ]
})
export class ListingDetailModule { }
