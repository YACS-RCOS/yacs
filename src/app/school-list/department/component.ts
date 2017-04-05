import { Component, Input } from '@angular/core';

export class Department {
    id: number;
    code: string;
    name: string;
}

@Component({
    selector: 'department',
    templateUrl: './component.html',
})
export class DepartmentComponent {
  // declare "dept" as a field of this component that comes from a []=
  // expression field in another component (schools, in this case)
  @Input() dept: Department;
}
