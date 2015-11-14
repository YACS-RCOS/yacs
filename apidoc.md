# YACS API

(this document is not final and currently subject to change)

The YACS API is now in version 5. Continued support for versions <= 4 should not be expected.
Pervious versions provided data for courses across multiple semesters, however this functionality
has been removed (for now). Only information for the current registration semester will be provided.

The API provides three endpoints for accessing catalog data, and all data is available in JSON
and XML format:

* `/api/v5/departments.<format>`

  The departments API returns id, name, and code of all departments or a single department:
  
  ```
    [
      {
        "department": {
          "id": 42, 
          "name": "Computer Science",
          "code": "CSCI"
        }
      },
      {
        "department": {
          "id": 2,
          "name": "Math",
          "code": "MATH"
        }
      }
    ]
  ```
  
* `/api/v5/courses.<format>`
  
  Courses can optionally be filtered by department,
  
  `/api/v5/courses.json?department_id=<department_id>`
  
  The Courses API returns the id, name, number, min_credits, and max_credits of courses,
  as well as the id's and codes of their associated departments:
  
  ```
  [
    {
      "course": {
        "id": 11,
        "name": "Data Structures",
        "number": 1200,
        "min_credits": 4,
        "max_credits": 4,
        "department": {
          "id": 42,
          "code": "CSCI"
        }
      }
    },
    {
      "course": {
        "id": 27,
        "name": "Calculus II",
        "number": 1010,
        "min_credits": 4,
        "max_credits": 4,
        "department": {
          "id": 2,
          "code": "MATH"
        }
      }
    } 
  ]
  ```
  
* `/api/v5/sections.<format>`

  Sections can optionally be filtered by course, `/api/v5/sections.<format>?course_id=<course_id>`
  
  The Sections API returns the id, name (number), crn, course_id, seats (total), and seats_taken of sections,
  as well as the id, time, period_type, and location of all of their associated periods:
  ```
  [
    {
      "section": {
        "id": 1,
        "name": "1",
        "crn": 11111,
        "course_id": 1,
        "seats": 10,
        "seats_taken": 5,
        "periods": [
          {
            "period": {
              "id": 1,
              "time": "4PM-6PM Tuesday",
              "period_type": "Lecture",
              "location": "DCC 318"
            }
          }
        ]
      }
    }
  ]
  ```
  
