import { Component, Input } from '@angular/core';
import { NoticeService } from './services/notice.service';
import { v4 as uuid } from 'uuid';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [
        NoticeService
    ]

})
export class AppComponent {
    constructor(private noticeService: NoticeService) {}

    public showingSidebar: boolean = true;

    ngOnInit () {
        this.showingSidebar = true;
        sessionStorage.setItem('userID', uuid());
    }

    public toggleSidebar (): void {
        this.showingSidebar = !this.showingSidebar;
    }

    // aids in moving contents of page down if notice bar is present
    public hasNotice (): boolean {
        return this.noticeService.hasNotice();
    }


}
