
[![Build Status](https://img.shields.io/travis/YACS-RCOS/yacs/master.svg)](https://travis-ci.org/YACS-RCOS/yacs)
[![Coverage Status](https://img.shields.io/coveralls/YACS-RCOS/yacs.svg)](https://coveralls.io/github/YACS-RCOS/yacs?branch=master)
[![Code Climate](https://img.shields.io/codeclimate/github/YACS-RCOS/yacs.svg)](https://codeclimate.com/github/YACS-RCOS/yacs)





# YACS - Yet Another Course Scheduler

Simple, Sane Course Scheduling.
YACS is a web-based course scheduler with an emphasis on usability.
YACS is 100% RPI home-grown and hosted. To use it, visit https://yacs.cs.rpi.edu

The old version of YACS (yacs.me) by Jeff Hui still exists but will not be updated. For the latest information and fastest experience use the [RPI site](https://yacs.cs.rpi.edu)!

Visit [our blog](https://yacsblog.wordpress.com/) for more updates and information.

Our iOS app repository can be found at https://github.com/JGrippo/YACSiOS


# YACS API

The YACS API is now in version 5. Continued support for versions <= 4 (yacs.me) should not be expected.
Previous versions provided data for courses across multiple semesters, however this functionality
has been removed (for now). Only information for the current registration semester will be provided.

The API provides four endpoints for accessing catalog data, and all data is available in JSON format.

### Schools
* `/api/v5/schools.json`
  
  The Schools API returns the id and name of one or many schools.
  
  ```
    {
      "schools":
      [
        {
          "id": 7,
          "name": "School of Humanties, Arts, and Social Sciences"
        },
        {
          "id": 9,
          "name": "School of Engineering"
        }
      ]
    }
  ```
  
  Queries available for Schools:
  
  #### id (one or many)
  * `/api/v5/schools.json?id=<id>` (like `show` method)
  * `/api/v5/schools.json?id=<id>,<id>,<id>`

  #### show_departments
    If you wish to include the associated departments of each school in the response,
    use the show_departments directive query. This query can be chained with any other query.
    * `/api/v5/schools.json?show_departments`
    * `/api/v5/schools.json?id=<id>&show_departments`

### Departments
* `/api/v5/departments.json`

  The departments API returns id, name, code, and school_id of one or many departments.
  
  ```
    {
      "departments":
      [
        {
          "id": 42, 
          "name": "Computer Science",
          "code": "CSCI",
          "school_id": 3
        },
        {
          "id": 2,
          "name": "Math",
          "code": "MATH",
          "school_id": 16
        }
      ]
    }
  ```
  Queries available for Departments:
  
  #### id (one or many)
  * `/api/v5/departments.json?id=<id>` (like `show` method)
  * `/api/v5/departments.json?id=<id>,<id>,<id>`
  
  #### school_id (one or many)
  * `/api/v5/departments.json?school_id=<school_id>` (like `show` method)
  * `/api/v5/departments.json?school_id=<school_id>,<school_id>,<school_id>`

  #### show_courses
    If you wish to include the associated courses of each department in the response,
    use the show_courses directive query. This query can be chained with any other query.
    * `/api/v5/departments.json?show_courses`
    * `/api/v5/departments.json?id=<id>&show_courses`

### Courses
* `/api/v5/courses.json`
  
  The Courses API returns the id, name, number, description, min_credits, and max_credits,
  and department_id of one or many courses.
  
  ```
  {
    courses: 
    [
      {
        "id": 11,
        "name": "Data Structures",
        "number": 1200,
        "description": "Programming concepts: functions, parameter passing, pointers, arrays, strings, structs, classes, templates. Mathematical tools: sets, functions, and relations, order notation, complexity of algorithms, proof by induction. Data structures and their representations: data abstraction and internal representation, sequences, trees, binary search trees, associative structures. Algorithms: searching and sorting, generic algorithms, iterative and recursive algorithms. Methods of testing correctness and measuring performance.Prerequisites/Corequisites: Prerequisite: CSCI 1100 or permission of instructor.When Offered: Fall and spring terms annually",
        "min_credits": 4,
        "max_credits": 4,
        "department_id": 42
      },
      {
        "id": 27,
        "name": "Calculus II",
        "number": 1010,
        "description": "Techniques and applications of integration, polar coordinates, parametric equations, infinite sequences and series, vector functions and curves in space, functions of several variables, and partial derivatives.Prerequisites/Corequisites: Prerequisite:  MATH 1010.When Offered: Fall and spring terms annually.",
        "min_credits": 4,
        "max_credits": 4,
        "department_id": 2
      } 
    ]
  }
  ```
  Queries available for Courses:
  
  #### id (one or many)
  * `/api/v5/courses.json?id=<id>` (like `show` method)
  * `/api/v5/courses.json?id=<id>,<id>,<id>`
  
  #### department_id (one or many)
  * `/api/v5/courses.json?department_id=<department_id>` (like `show` method)
  * `/api/v5/courses.json?department_id=<department_id>,<department_id>,<department_id>`

  #### search
    In addition to primary/foreign key queries, courses can be full-text searched.
    The api will attempt to match a given search query against several columns in the
    course table and its associated tables. This allows you to search against a course's
    name and number, its department's name and code, and the instructors of its sections.
    Again, the columns searched are:

      * course.name
      * course.number
      * department.name
      * department.code
      * section.instructors
      
    A search query can be given as a plain-old url-formatted string, with search terms separated by spaces.
    The courses returned are the closest matches to the provided query, in order of how closely they match the query.
    * `/api/v5/courses.json?search=<some url formatted string>`

  #### show_sections
    If you wish to include the associated sections of each course in the response,
    use the show_sections directive query. This query can be chained with any other query.
    * `/api/v5/courses.json?show_sections`
    * `/api/v5/courses.json?id=<id>&show_sections`
    
  #### show_periods
    If `show_sections` is used, then the periods of each section can be included with the
    show_periods directive query. This query can be chained with any other query.
    * `/api/v5/courses.json?show_sections&show_periods`
    * `/api/v5/courses.json?id=<id>&show_sections&show_periods`
    
    ```
    {
      courses: 
      [
        {
          "id": 65,
          "name": "Data Structures",
          "number": 1200,
          "description": "Programming concepts: functions, parameter passing, pointers, arrays, strings, structs, classes, templates. Mathematical tools: sets, functions, and relations, order notation, complexity of algorithms, proof by induction. Data structures and their representations: data abstraction and internal representation, sequences, trees, binary search trees, associative structures. Algorithms: searching and sorting, generic algorithms, iterative and recursive algorithms. Methods of testing correctness and measuring performance.Prerequisites/Corequisites: Prerequisite: CSCI 1100 or permission of instructor.When Offered: Fall and spring terms annually",
          "min_credits": 4,
          "max_credits": 4,
          "department_id": 42,
          "sections": [ < see sections api > ]
        },
        {
          "id": 27,
          "name": "Calculus II",
          "number": 1010,
          "description": "Techniques and applications of integration, polar coordinates, parametric equations, infinite sequences and series, vector functions and curves in space, functions of several variables, and partial derivatives.Prerequisites/Corequisites: Prerequisite:  MATH 1010.When Offered: Fall and spring terms annually.",
          "min_credits": 4,
          "max_credits": 4,
          "department_id": 2,
          "sections": [ < see sections api > ]
        } 
      ]
    }
    ```

    
### Sections
* `/api/v5/sections.json`

  The Sections API returns the id, name (number), crn, course_id, seats (total), and seats_taken, and instructors
  of one or many sections, as well as the type, day, start, and end of all of their associated periods. The start
  and end are times in military form as strings.

  ```
  {
    sections:
    [
      {
        "id": 108,
        "name": "01",
        "crn": 87654,
        "course_id": 65,
        "seats": 10,
        "seats_taken": 5,
        "instructors": ["Goldschmidt", "Krishnamoorthy"],
        "num_periods": 2
      },
      {
        "id": 112,
        "name": "02",
        "crn": 87655,
        "course_id": 65,
        "seats": 10,
        "seats_taken": 10,
        "instructors": [],
        "num_periods": 2
      }
    ]
  }
  ```
  Queries available for Sections:
  
  #### id (one or many)
  * `/api/v5/sections.json?id=<id>` (like `show` method)
  * `/api/v5/sections.json?id=<id>,<id>,<id>`
  
  #### course_id (one or many)
  * `/api/v5/sections.json?course_id=<course_id>` (like `show` method)
  * `/api/v5/sections.json?course_id=<course_id>,<course_id>,<course_id>`
  
  #### show_periods
    If you wish to include the associated periods (meetings/blocks/etc.) of each section in the response,
    use the show_periods directive query. This query can be chained with any other query.
    * `/api/v5/sections.json?show_periods`
    * `/api/v5/sections.json?id=<id>&show_periods`

    ```
    {
      sections:
      [
        {
          "id": 108,
          "name": "01",
          "crn": 87654,
          "course_id": 65,
          "seats": 10,
          "seats_taken": 5,
          "instructors": ["Goldschmidt", "Krishnamoorthy"],
          "periods": [
            {
              "type": "LEC"
              "day": 1,
              "start": "0800",
              "end": "0950"
            },
            {
              "type": "LEC"
              "day": 4,
              "start": "0800",
              "end": "0950"
            }
          ]
        },
        {
          "id": 112,
          "name": "02",
          "crn": 87655,
          "course_id": 65,
          "seats": 10,
          "seats_taken": 10,
          "instructors": [],
          "periods": [
            {
              "type": "LEC"
              "day": 1,
              "start": "1000",
              "end": "1050"
            },
            {
              "type": "LEC"
              "day": 4,
              "start": "1000",
              "end": "1050"
            }
          ]
        }
      ]
    }
    ```
