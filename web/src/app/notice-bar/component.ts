import { Component, OnChanges, Input } from '@angular/core';
import { NoticeService } from '../services/notice.service';
import { Notice } from '../models/notice.model';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'notice-bar',
  templateUrl: './component.html',
  styleUrls: ['component.scss'],
  animations: [
    trigger('fadeOut', [
      state('true', style({ opacity: 1 })),
      state('false', style({ opacity: 0 })),
      transition('false => true', animate('0.4s')),
      transition('true => false', animate('1.2s'))
    ])
  ]
})
export class NoticeBarComponent implements OnChanges {
  constructor(private noticeService: NoticeService) {}

  @Input() isShown: boolean = this.noticeService.hasNotice();

  hasNotice(): boolean {
    return this.noticeService.hasNotice();
  }

  getNotice(): Notice {
    return this.noticeService.getNotice();
  }

  dismissNotice(): void {
    this.isShown = false;
  }

  done(event: AnimationEvent) {
    if (!this.isShown && this.noticeService.hasNotice())
      this.noticeService.dismiss(); //dismiss when animation is done
    this.isShown = this.noticeService.hasNotice();
  }

  ngOnChanges() {}
}
