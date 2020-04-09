import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { School } from 'yacs-api-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'school',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class SchoolComponent {
  @Input() school: School;

  constructor(private router:Router, private http: HttpClient){}

  public changeRoute(id): void {
    //gets the name of the department
    let schoolName: string;
    for(let sub of this.school.subjects){
      if(sub.id == id){
        schoolName = sub.longname;
      }
    }
    //Sends the department the user clicked to the user system backend
    this.http.post('https://api.yacs.maoyu.wang/userEvent', {
      "uid": sessionStorage.getItem('userID'),
      "eventID": "5",
      "data": {
          'Department Title' : schoolName

      },
      "createdAt": Date.now()
    }).subscribe(
      data => {console.log(data)},
      err => {console.log(err)}
    );

    this.router.navigateByUrl('/courses?subject_id=' + id);
  }

  onKeydown(evt: KeyboardEvent, id) {
    const keyCode = evt.which;
    const enterKey = 13;
    if(enterKey == keyCode){
      //gets the name of the department
      let schoolName: string;
      for(let sub of this.school.subjects){
        if(sub.id == id){
          schoolName = sub.longname;
        }
      }
      //Sends the department the user clicked to the user system backend
      this.http.post('https://api.yacs.maoyu.wang/userEvent', {
        "uid": sessionStorage.getItem('userID'),
        "eventID": "5",
        "data": {
            'Department Title' : schoolName

        },
        "createdAt": Date.now()
      }).subscribe(
        data => {console.log(data)},
        err => {console.log(err)}
      );
      this.router.navigateByUrl('/courses?subject_id=' + id);
    }
  }
}