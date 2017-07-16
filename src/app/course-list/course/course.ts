import { Section } from '../section/section';

export class Course {
  id: number;
  name: string;
  num: string;
  department_code: string;
  department_id: number;
  min_credits:number;
  max_credits:number;
  description: string;
  sections: Section[];
}