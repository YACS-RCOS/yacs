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
    console.log(url);
    if (url.includes('schedules?section_ids=')) {
      console.log('yes');

      // this.SelectionService.toggleSection(section);
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
