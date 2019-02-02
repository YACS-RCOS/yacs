import { ApplicationRecord } from "./application-record";
import { Subject } from "./subject";
export declare class School extends ApplicationRecord {
    static jsonapiType: string;
    longname: string;
    uuid: string;
    subjects: Subject[];
}
