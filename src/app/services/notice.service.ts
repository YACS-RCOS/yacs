import { Injectable } 	from '@angular/core';
import { Notice } 		from '../models/notice.model';

@Injectable()
//store / handle state of notices (provider)
export class NoticeService {

	private noticeQueue : Notice[];		//array of all undismissed notices
	private dismissedSet = new Set();	//set of ids of dismissed notices
	private next: number;				//next notice (equal to length of noticeQueue, made for clarity)

	constructor(noticeQueue: Notice[])	{
		this.noticeQueue = [
			{
				id: 0,
				body: "something",
				time: new Date(),
			} as Notice,

			{
				id: 1,
				body: "HELLO",
				time: new Date()
			} as Notice,

			{
				id: 2,
				body: "LAST",
				time: new Date()
			} as Notice
		];
		this.next = noticeQueue.length;
	}

	public getNotice () : string {
		return `test`;
		//return this.noticeQueue[this.next].body;
	}

	public hasNotice() : boolean {
		return true;
		// if (this.next == -1) {
		// 	return true;
		// }
		// return false;
	}

	public dismiss() : void {
		this.dismissedSet.add(this.noticeQueue[this.next].id);
		this.next--;
		
	}

	//pull new notices (update next)
}