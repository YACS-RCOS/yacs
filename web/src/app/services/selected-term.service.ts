import {Injectable} from '@angular/core';
import {Term} from 'yacs-api-client';
import {Subject, Subscription} from 'rxjs';

@Injectable()
export class SelectedTermService {
  // a subject that can be written to and subscribed to for the selected term
  public selectedTerm: Subject<Term>;
  public activeTerm: Subject<Term>;
  // hold the terms in two forms: a mapping between the graphiti id and the term, and an array for ordering
  protected terms: Map<string, Term>;
  // cache the current ordinal and graphiti ID
  protected currentOrdinal: number;
  protected currentId: string;
  protected activeId: string;

  constructor() {
    this.terms = new Map<string, Term>();
    this.selectedTerm = new Subject<Term>();
    this.activeTerm = new Subject<Term>();
    this.currentOrdinal = 0;
    // acquire all the terms upon load
    Term.all().then(terms => {
      terms.data.forEach(term => {
        // place the terms in the map and the array
        this.terms.set(term.id, term);
      });
      if (localStorage['atFirstTerm'] === 'true') {
        // if the local storage term was the first term (the most recent)
        // set the selected term to the most recent instead of restoring
        // the last setting, which may unnecessarily obfuscate the most
        // recent term
        this.setSelectedTermByOrdinal(this.terms.size - 1);
      } else {
        // otherwise restore the selectedTerm from localStorage, verifying its validity
        // and defaulting to the most recent
        if (localStorage['selectedTerm'] !== undefined) {
          const localTerm = this.terms.get(localStorage['selectedTerm']);
          if (localTerm === undefined) {
            this.setSelectedTermByOrdinal(this.terms.size - 1);
          } else {
            this.currentId = localTerm.id;
            this.setSelectedTerm(localTerm.id);
          }
        } else {
          this.setSelectedTermByOrdinal(this.terms.size - 1);
        }
      }
      if (localStorage['activeTerm'] !== undefined) {
        this.activeId = localStorage['activeTerm'];
        // do not push to Subject because it will cause a clear
        // in Selection service -- the only purpose of the subject in its current
        // state is to do that anyway.
      } else {
        this.activeId = Array.from(this.terms.keys()).pop();
      }
      console.log(this.activeId);
    });
    // internal subscription to term for localstorage
    this.subscribeToTerm((term: Term) => {
      this.currentId = term.id;
      localStorage.setItem('selectedTerm', term.id);
      localStorage.setItem('atFirstTerm', `${this.currentOrdinal === this.terms.size - 1}`);
    });
    this.subscribeToActiveTerm((term: Term) => {
      this.activeId = this.currentId;
      if (this.currentOrdinal === this.terms.size - 1) {
        localStorage.removeItem('activeTerm');
      } else {
        localStorage.setItem('activeTerm', term.id);
      }
    });
  }

  /**
   * Set the selected term by Graphiti ID
   * @param id
   * @return The success of setting the term (returns false if the ID was invalid)
   */
  public setSelectedTerm(id: string): boolean {
    const nTerm = this.terms.get(id);
    if (nTerm !== undefined) {
      this.currentOrdinal = Array.from(this.terms.values()).findIndex((term) => term.id === id);
      this.selectedTerm.next(nTerm);
      return true;
    }
    return false;
  }

  /**
   * Sets the selected term by its ordinal
   * @param newOrdinal
   * @return The success of setting the term (returns false if the ordinal was out of bounds)
   */
  public setSelectedTermByOrdinal(newOrdinal: number): boolean {
    if (newOrdinal >= 0 && newOrdinal < this.terms.size) {
      this.currentOrdinal = newOrdinal;
      this.selectedTerm.next(Array.from(this.terms.values())[newOrdinal]);
      return true;
    }
    return false;
  }

  /**
   * Attaches a subscriber to the selectedTerm, piping errors to console.error.
   * @param func
   */
  public subscribeToTerm(func: (Term) => void): Subscription {
    return this.selectedTerm.subscribe(func, (e) => { console.error(e); }, () => {});
  }

  /**
   * Attaches a subscriber to the activeTerm, piping errors to console.error.
   * @param func
   */
  public subscribeToActiveTerm(func: (Term) => void): Subscription {
    return this.activeTerm.subscribe(func, (e) => { console.error(e); }, () => {});
  }

  public setSelectedTermAsActive(): void {
    this.activeTerm.next(this.terms.get(this.currentId));
  }

  public get getCurrentOrdinal(): number {
    return this.currentOrdinal;
  }

  public get getMaximumOrdinal(): number {
    return this.terms.size - 1;
  }

  public get getCurrentTermId(): string {
    return this.currentId;
  }

  // for the future perhaps
  public get getTerms(): Map<string, Term> {
    return this.terms;
  }

  public get isCurrentTermActive(): boolean {
    return this.currentId === this.activeId;
  }

}
