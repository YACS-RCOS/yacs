import { Component, Input } from '@angular/core';
import { Router }           from '@angular/router';
import { NoticeService } 		from '../services/notice.service';
import { Notice } 					from '../models/notice.model';

@Component({
  selector: 'notice-bar',
  templateUrl: './component.html',
  styleUrls: ['component.scss'],
})

//controller of information
export class NoticeBarComponent {

  constructor(private noticeService: NoticeService) {}

  public hasNotice() : boolean {
  	return this.noticeService.hasNotice();
  }

  public getNotice() : string {
  	return this.noticeService.getNotice();
  }

}
