import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'header-bar',
  templateUrl: './component.html',
  styleUrls: ['component.scss']
})

export class HeaderComponent {

  constructor(private router: Router) { }

  search(term: string) {
    this.router.navigate(['/courses'],
      { queryParams: {
        search: term
      }});
  }
}
