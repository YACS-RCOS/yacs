import { Component, Input, OnInit } from '@angular/core';
import { NoticeService } 		from '../services/notice.service';
import { Notice } 					from '../models/notice.model';

@Component({
  selector: 'notice-bar',
  templateUrl: './component.html',
  styleUrls: ['component.scss'],
})
export class NoticeBarComponent implements OnInit {

  //display first notice, the rest will be displayed by the dismiss function
  ngOnInit() {
    document.getElementById("noticeText").innerHTML = this.getNotice();
  }

  constructor(private noticeService : NoticeService) {}

  hasNotice() : boolean {
    return this.noticeService.hasNotice();
  }

  getNotice() : string {
    return this.noticeService.getNotice();
  }

  dismissNotice() : void {
    this.noticeService.dismiss();
  }

}
