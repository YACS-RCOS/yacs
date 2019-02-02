import { ApplicationRecord } from "./application-record";
import { Course } from "./course";
import { Term } from "./term";
import { Section } from "./section";
export declare class Listing extends ApplicationRecord {
    static jsonapiType: string;
    tags: string[];
    active: boolean;
    maxCredits: number;
    minCredits: number;
    description: string;
    longname: string;
    courseShortname: string;
    subjectShortname: string;
    uuid: string;
    course: Course;
    term: Term;
    sections: Section[];
}
