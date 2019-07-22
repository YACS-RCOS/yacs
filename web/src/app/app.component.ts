import { Component, Input } from '@angular/core';
import { NoticeService } from './services/notice.service';
import { SelectionService } from './services/selection.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [
	NoticeService
	]

})
export class AppComponent {
	constructor(
		private noticeService: NoticeService,
		private selectionService: SelectionService) {}

	public showingSidebar: boolean = true;
	
	ngOnInit () {
		this.showingSidebar = true;

		// check if schedule link entered
		let url: string = window.location.href;
		let i1: number = url.indexOf('schedules?section_ids=');
		let i2: number = url.indexOf('&schedule_index=');
		console.log(url);
		if (i1 != -1) {
			console.log(url.indexOf('schedules?section_ids='));
			let end: number = (i2 != -1) ? i2 : url.length;
			let sections: number[] = url.substring(i1 + 22, end).split(',').map(Number);
			console.log(sections);
		
			let index: number = 0;
			if (i2 != -1) {
				index = parseInt(url.substring(i2 + 16), 10);
			}

			console.log(index);
		}
	}

	public toggleSidebar (): void {
		this.showingSidebar = !this.showingSidebar;
	}

	//aids in moving contents of page down if notice bar is present
	public hasNotice (): boolean {
		return this.noticeService.hasNotice();
	}


}
