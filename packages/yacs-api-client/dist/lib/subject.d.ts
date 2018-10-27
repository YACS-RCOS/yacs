import { ApplicationRecord } from "./application-record";
import { School } from "./school";
import { Course } from "./course";
export declare class Subject extends ApplicationRecord {
    static jsonapiType: string;
    longname: string;
    shortname: string;
    uuid: string;
    school: School;
    courses: Course[];
}
