import { Component, Input } from '@angular/core';

@Component({
  selector: 'no-results',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})

export class NoResultsComponent {
  @Input() search: string;
}