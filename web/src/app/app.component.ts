import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Section } from 'yacs-api-client';
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
		private router: Router,
		private selectionService: SelectionService) {}

	public showingSidebar: boolean = true;
	
	ngOnInit () {
		this.showingSidebar = true;
	}

	public toggleSidebar (): void {
		this.showingSidebar = !this.showingSidebar;
	}

	//aids in moving contents of page down if notice bar is present
	public hasNotice (): boolean {
		return this.noticeService.hasNotice();
	}


}
