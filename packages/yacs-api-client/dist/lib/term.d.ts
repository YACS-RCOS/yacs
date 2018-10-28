import { ApplicationRecord } from "./application-record";
import { Listing } from "./listing";
export declare class Term extends ApplicationRecord {
    static jsonapiType: string;
    longname: string;
    shortname: string;
    uuid: string;
    listings: Listing[];
}
