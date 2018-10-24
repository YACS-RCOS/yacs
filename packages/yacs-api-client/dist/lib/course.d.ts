import { ApplicationRecord } from "./application-record";
import { Subject } from "./subject";
import { Listing } from "./listing";
export declare class Course extends ApplicationRecord {
    static jsonapiType: string;
    tags: string[];
    shortname: string;
    uuid: string;
    subjects: Subject[];
    listings: Listing[];
}
