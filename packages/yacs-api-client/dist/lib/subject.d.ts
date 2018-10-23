import { ApplicationRecord } from "./application-record";
export declare class Subject extends ApplicationRecord {
    static jsonapiType: string;
    longname: string;
    shortname: string;
    uuid: string;
}
