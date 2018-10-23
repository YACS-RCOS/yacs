import { ApplicationRecord } from "./application-record";
export declare class Course extends ApplicationRecord {
    static jsonapiType: string;
    tags: string[];
    shortname: string;
    uuid: string;
}
