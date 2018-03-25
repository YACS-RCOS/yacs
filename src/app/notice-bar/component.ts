import { Component, Input } from '@angular/core';
import { NoticeService } 		from '../services/notice.service';
import { Notice } 					from '../models/notice.model';

@Component({
  selector: 'notice-bar',
  templateUrl: './component.html',
  styleUrls: ['component.scss'],
})
export class NoticeBarComponent {

  constructor(private noticeService : NoticeService) {}

  hasNotice() : boolean {
    return this.noticeService.hasNotice();
  }

  getNotice() : Notice {
    return this.noticeService.getNotice();
  }

  dismissNotice() : void {
    this.noticeService.dismiss();
  }

}
