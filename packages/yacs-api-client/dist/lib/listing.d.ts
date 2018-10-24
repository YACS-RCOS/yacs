import { ApplicationRecord } from "./application-record";
import { Course } from "./course";
import { Term } from "./term";
export declare class Listing extends ApplicationRecord {
    static jsonapiType: string;
    tags: string[];
    active: boolean;
    max_credits: number;
    min_credits: number;
    description: string;
    longname: string;
    uuid: string;
    courses: Course[];
    terms: Term[];
}
