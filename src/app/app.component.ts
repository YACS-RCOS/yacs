import { Component } from '@angular/core';
import { ConstantsService } from './services/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    ConstantsService
  ]
})
export class AppComponent {
  // inject ConstantsService
  // constructor(private constants: ConstantsService) {}
}
