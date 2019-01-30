import { ApplicationRecord } from "./application-record";
import { Listing } from "./listing";
export declare class Period {
    day: number;
    start: string;
    end: string;
    type: string;
    location: string;
    section: Section;
}
export declare class Section extends ApplicationRecord {
    static jsonapiType: string;
    active: boolean;
    shortname: string;
    crn: string;
    instructors: string[];
    seats: number;
    seatsTaken: number;
    uuid: string;
    periods: Period[];
    conflictIds: number[];
    listing: Listing;
}
