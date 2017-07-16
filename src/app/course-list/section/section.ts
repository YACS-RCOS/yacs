import { Period } from './period';

export class Section {
  id: number;
  course_id: number;
  name: string;
  crn: number;
  instructors: string[];
  seats: number;
  seats_taken: number;
  conflicts: number[];
  periods: Period[];
  num_periods: number;
  course_name: string;
  course_number: number;
  department_code: string;
}