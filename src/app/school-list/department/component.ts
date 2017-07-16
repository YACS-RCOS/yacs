import { Component, Input } from '@angular/core';
import { Department } from './department'

@Component({
    selector: 'department',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class DepartmentComponent {
  // declare "dept" as a field of this component that comes from a []=
  // expression field in another component (schools, in this case)
  @Input() dept: Department;
}
