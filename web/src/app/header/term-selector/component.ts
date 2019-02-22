import {Component, OnInit} from '@angular/core';
import {SelectedTermService} from '../../services/selected-term.service';
@Component({
    selector: 'term-selector',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class TermSelectorComponent implements OnInit {

    constructor (
        private selectedTermService: SelectedTermService) { }



    ngOnInit (): void {
        this.selectedTermService.getData().then(console.log);
    }
}
