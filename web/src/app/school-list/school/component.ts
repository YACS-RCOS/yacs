import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { School } from 'yacs-api-client';

@Component({
  selector: 'school',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SchoolComponent {
  @Input() school: School;

  constructor(private router:Router){}

  public changeRoute(id): void {
    this.router.navigateByUrl('/courses?subject_id=' + id);
  }

  onKeydown(evt: KeyboardEvent, id) {
    const keyCode = evt.which;
    const enterKey = 13;
    if(enterKey == keyCode){
      this.router.navigateByUrl('/courses?subject_id=' + id);
    }
  }
}