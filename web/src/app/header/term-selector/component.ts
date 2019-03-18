import {Component, OnInit} from '@angular/core';
import {SelectedTermService} from '../../services/selected-term.service';
import {Term} from 'yacs-api-client';

@Component({
  selector: 'term-selector',
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
export class TermSelectorComponent implements OnInit {

  // cache the name of the term
  private internalName: string;

  constructor(
    private selectedTermService: SelectedTermService) {
    // default the name to 'loading' until it loads
    this.internalName = 'loading';
  }

  ngOnInit(): void {
    this.selectedTermService.subscribeToTerm((term: Term) => {
      this.internalName = term.longname;
    });
  }

  get isFirstTerm(): boolean {
    return this.selectedTermService.getCurrentOrdinal === 0;
  }

  get isLastTerm(): boolean {
    return this.selectedTermService.getCurrentOrdinal === this.selectedTermService.getMaximumOrdinal;
  }

  get isActiveTerm(): boolean {
    return this.selectedTermService.isCurrentTermActive;
  }

  /**
   * Move to the previous (more recent) Term
   */
  previousTerm() {
    const ord = this.selectedTermService.getCurrentOrdinal;
    if (ord > 0) {
      this.selectedTermService.setSelectedTermByOrdinal(ord - 1);
    }
  }

  /**
   * Move to the next (less recent) Term
   */
  nextTerm() {
    const ord = this.selectedTermService.getCurrentOrdinal;
    if (ord < this.selectedTermService.getMaximumOrdinal) {
      this.selectedTermService.setSelectedTermByOrdinal(ord + 1);
    }
  }
}
