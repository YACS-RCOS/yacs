import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import { Subject, Subscription, Subscriber } from 'rxjs/Rx';

import { Listing } from 'yacs-api-client';

@Injectable()
export class SidebarService {
  private setItem (key: string, value: object) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private getItem (data: string) {
    return JSON.parse(localStorage.getItem(data));
  }

  public getListingIds (): Set<string> {
  	return new Set(this.getItem('listings') || []);
  }

	public addListing (listing: Listing) {
		const currentListingIds = this.getListingIds();
		currentListingIds.add(listing.id);
		this.setItem('listings', currentListingIds);
	}

	public removeListing (listing: Listing) {
		const currentListingIds = this.getListingIds();
		currentListingIds.delete(listing.id);
		this.setItem('listings', currentListingIds);
	}
}
