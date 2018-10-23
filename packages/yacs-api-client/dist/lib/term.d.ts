import { ApplicationRecord } from "./application-record";
export declare class Term extends ApplicationRecord {
    static jsonapiType: string;
    longname: string;
    shortname: string;
    uuid: string;
}
