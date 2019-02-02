import { ApplicationRecord } from "./application-record";
import { Section } from "./section";
export declare class Schedule extends ApplicationRecord {
    static jsonapiType: string;
    uuid: string;
    sections: Section[];
}
