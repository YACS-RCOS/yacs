import { Component, Input } from '@angular/core';
import { ConstantsService } from './services/constants';
import { NoticeService } from './services/notice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    ConstantsService,
    NoticeService
  ]

})
export class AppComponent {
  

  constructor(private noticeService: NoticeService) {}

  public showingSidebar = true;
  
  ngOnInit() {
    this.showingSidebar = true;
  }

  //aids in moving contents of page down if notice bar is present
  hasNotice() : boolean {
    return this.noticeService.hasNotice();
  }


}
