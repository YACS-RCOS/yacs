import { Component } from '@angular/core';
// Every component must be declared in one - and only one - Angular module.

@Component({
  selector: 'header-bar',
  templateUrl: './component.html',
  styleUrls: ['component.scss']
})

export class HeaderComponent {
  searchText = '';

}
