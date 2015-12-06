/* Use this script to create test data.
   I'm writing this so we have some realistic RPI-like data to work on,
   and also so we have the ability to nuke and restore the database easily.
   I run this with psql yacs-dev < test_data_SETUP.sql
*/ 

-- delete everything from existing tables first?
DELETE FROM schools *;
DELETE FROM departments *;
DELETE FROM courses *;
DELETE FROM sections *;

-- make some schools
INSERT INTO schools (name) VALUES ('School of Science');
INSERT INTO schools (name) VALUES ('School of Humanities, Arts and Social Sciences');

-- make some departments
INSERT INTO departments (code, name, school_id) VALUES ('ARTS', 'Arts', (SELECT id FROM schools WHERE name = 'School of Humanities, Arts and Social Sciences'));
INSERT INTO departments (code, name, school_id) VALUES ('CSCI', 'Computer Science', (SELECT id FROM schools WHERE name = 'School of Science'));
INSERT INTO departments (code, name, school_id) VALUES ('MATH', 'Mathematical Sciences', (SELECT id FROM schools WHERE name = 'School of Science'));

-- make some courses
INSERT INTO courses (department_id, name, number, min_credits, max_credits) VALUES ((SELECT id FROM departments WHERE code = 'CSCI'), 'Computer Science 1', 1100, 4, 4);
INSERT INTO courses (department_id, name, number, min_credits, max_credits) VALUES ((SELECT id FROM departments WHERE code = 'CSCI'), 'Data Structures', 1200, 4, 4);
INSERT INTO courses (department_id, name, number, min_credits, max_credits) VALUES ((SELECT id FROM departments WHERE code = 'CSCI'), 'Beginning Programming for Engineers', 1190, 1, 1);
INSERT INTO courses (department_id, name, number, min_credits, max_credits) VALUES ((SELECT id FROM departments WHERE code = 'CSCI'), 'Foundations of Computer Science', 2200, 4, 4);
INSERT INTO courses (department_id, name, number, min_credits, max_credits) VALUES ((SELECT id FROM departments WHERE code = 'CSCI'), 'Intro to Algorithms', 2300, 4, 4);
INSERT INTO courses (department_id, name, number, min_credits, max_credits) VALUES ((SELECT id FROM departments WHERE code = 'CSCI'), 'Operating Systems', 4210, 4, 4);


INSERT INTO courses (department_id, name, number, min_credits, max_credits) VALUES ((SELECT id FROM departments WHERE code = 'ARTS'), 'Music and Sound', 1010, 4, 4);
INSERT INTO courses (department_id, name, number, min_credits, max_credits) VALUES ((SELECT id FROM departments WHERE code = 'ARTS'), 'Digital Filmmaking', 1030, 4, 4);
INSERT INTO courses (department_id, name, number, min_credits, max_credits) VALUES ((SELECT id FROM departments WHERE code = 'ARTS'), 'Basic Drawing', 1200, 4, 4);
INSERT INTO courses (department_id, name, number, min_credits, max_credits) VALUES ((SELECT id FROM departments WHERE code = 'ARTS'), 'Intermediate Video', 2010, 4, 4);

INSERT INTO courses (department_id, name, number, min_credits, max_credits) VALUES ((SELECT id FROM departments WHERE code = 'MATH'), 'Calculus 1', 1010, 4, 4);
INSERT INTO courses (department_id, name, number, min_credits, max_credits) VALUES ((SELECT id FROM departments WHERE code = 'MATH'), 'Contemporary Mathematical Ideas in Society', 1620, 4, 4);
INSERT INTO courses (department_id, name, number, min_credits, max_credits) VALUES ((SELECT id FROM departments WHERE code = 'MATH'), 'Abstract Algebra', 4010, 4, 4);

-- make some sections
-- what is "name" for? Type?
INSERT INTO sections (name, crn, course_id, seats, seats_taken) VALUES ('1', 17358, (SELECT id FROM courses WHERE name = 'Calculus 1'), 20, 0);
INSERT INTO sections (name, crn, course_id, seats, seats_taken) VALUES ('2', 17359, (SELECT id FROM courses WHERE name = 'Calculus 1'), 20, 5);
INSERT INTO sections (name, crn, course_id, seats, seats_taken) VALUES ('1', 23834, (SELECT id FROM courses WHERE name = 'Contemporary Mathematical Ideas in Society'), 16, 4);
INSERT INTO sections (name, crn, course_id, seats, seats_taken) VALUES ('1', 92932, (SELECT id FROM courses WHERE name = 'Abstract Algebra'), 20, 20);

INSERT INTO sections (name, crn, course_id, seats, seats_taken) VALUES ('1', 24879, (SELECT id FROM courses WHERE name = 'Computer Science 1'), 30, 12);
INSERT INTO sections (name, crn, course_id, seats, seats_taken) VALUES ('2', 24880, (SELECT id FROM courses WHERE name = 'Computer Science 1'), 30, 1);
INSERT INTO sections (name, crn, course_id, seats, seats_taken) VALUES ('1', 28182 , (SELECT id FROM courses WHERE name = 'Data Structures'), 300, 187);
INSERT INTO sections (name, crn, course_id, seats, seats_taken) VALUES ('1', 57722, (SELECT id FROM courses WHERE name = 'Beginning Programming for Engineers'), 25, 2);
INSERT INTO sections (name, crn, course_id, seats, seats_taken) VALUES ('1', 82819, (SELECT id FROM courses WHERE name = 'Foundations of Computer Science'), 150, 31);
INSERT INTO sections (name, crn, course_id, seats, seats_taken) VALUES ('1', 19204, (SELECT id FROM courses WHERE name = 'Intro to Algorithms'), 20, 3);
INSERT INTO sections (name, crn, course_id, seats, seats_taken) VALUES ('2', 99877, (SELECT id FROM courses WHERE name = 'Intro to Algorithms'), 20, 20);
INSERT INTO sections (name, crn, course_id, seats, seats_taken) VALUES ('1', 12345, (SELECT id FROM courses WHERE name = 'Operating Systems'), 100, 90);

INSERT INTO sections (name, crn, course_id, seats, seats_taken) VALUES ('1', 32928, (SELECT id FROM courses WHERE name = 'Music and Sound'), 19, 19);
INSERT INTO sections (name, crn, course_id, seats, seats_taken) VALUES ('1', 458923, (SELECT id FROM courses WHERE name = 'Basic Drawing'), 19, 19);
INSERT INTO sections (name, crn, course_id, seats, seats_taken) VALUES ('1', 10389, (SELECT id FROM courses WHERE name = 'Digital Filmmaking'), 19, 19);
INSERT INTO sections (name, crn, course_id, seats, seats_taken) VALUES ('1', 58737, (SELECT id FROM courses WHERE name = 'Intermediate Video'), 19, 19);


