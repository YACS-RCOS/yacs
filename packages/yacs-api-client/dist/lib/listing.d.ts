import { ApplicationRecord } from "./application-record";
export declare class Listing extends ApplicationRecord {
    static jsonapiType: string;
    tags: string[];
    active: boolean;
    max_credits: number;
    min_credits: number;
    description: string;
    longname: string;
    uuid: string;
}
