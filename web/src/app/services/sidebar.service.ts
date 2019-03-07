import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import { Subject, Subscription, Subscriber } from 'rxjs/Rx';

import { Listing } from 'yacs-api-client';

@Injectable()
export class SidebarService {
	private event = new Subject();

	public subscribe (next): Subscription {
		return this.event.subscribe(next);
	}

  public getListingIds (): Set<string> {
  	return new Set(this.getItem('listings'));
  }

	public addListing (listing: Listing) {
		const currentListingIds = this.getListingIds();
		currentListingIds.add(listing.id);
		this.setItem('listings', currentListingIds);
		this.next();
	}

	public removeListing (listing: Listing) {
		const currentListingIds = this.getListingIds();
		currentListingIds.delete(listing.id);
		this.setItem('listings', currentListingIds);
		this.next();
	}

	private next () {
		this.event.next('event');
	}

  private setItem (key: string, value: Set<string>) {
    localStorage.setItem(key, JSON.stringify(Array.from(value)));
  }

  private getItem (data: string) {
    return JSON.parse(localStorage.getItem(data));
  }	
}
