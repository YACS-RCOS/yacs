import { ApplicationRecord } from "./application-record";
import { Subject } from "./subject";
import { Listing } from "./listing";
export declare class Course extends ApplicationRecord {
    static jsonapiType: string;
    shortname: string;
    uuid: string;
    subject: Subject;
    listings: Listing[];
}
