import { Component, Input } from '@angular/core';
import { Subject } from 'yacs-api-client'

@Component({
    selector: 'subject',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class SubjectComponent {
  @Input() subject: Subject;
}
