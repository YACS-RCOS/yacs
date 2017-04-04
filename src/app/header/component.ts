import { Component } from '@angular/core';
// Every component must be declared in one - and only one - Angular module.

@Component({
  selector: 'header-bar',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  searchText = '';
}
