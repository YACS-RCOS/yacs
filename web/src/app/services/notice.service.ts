import { Injectable } from '@angular/core';
import { Notice } from '../models/notice.model';

@Injectable()
export class NoticeService {
  private noticeQueue: Notice[]; //array of all undismissed notices
  private dismissedSet = new Set(); //set of ids of dismissed notices
  private next: number; //next notice (equal to length of noticeQueue, made for clarity)

  constructor() {
    this.noticeQueue = [];
    this.next = this.noticeQueue.length - 1;
  }

  public getNotice(): Notice {
    return this.noticeQueue[this.next];
  }

  public hasNotice(): boolean {
    if (this.next == -1) {
      return false;
    }
    return true;
  }

  public dismiss(): void {
    this.dismissedSet.add(this.noticeQueue[this.next].id);
    this.next--;
  }
}
