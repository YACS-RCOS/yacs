import { ApplicationRecord } from "./application-record";
import { Listing } from "./listing";
export declare class Section extends ApplicationRecord {
    static jsonapiType: string;
    tags: string[];
    active: boolean;
    max_credits: number;
    min_credits: number;
    description: string;
    longname: string;
    uuid: string;
    listing: Listing;
}
