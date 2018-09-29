Feature: Courses View
  In order to make a schedule
  As a user
  I would like to browse courses

Background: 
  Given the following schools exist:
    | id | name                  |
    | 1  | School of Engineering |
  And the following departments exist:
    | id | code   | name             | school_id |
    | 6  | CSCI   | Computer Science | 1         |
  And the following courses exist:
    | id | number | name             | department_id |
    | 12 | 1200   | Data Structures  | 6             |

@javascript
Scenario: view courses
  Given I go to the home page
  When I click the department "CSCI"
  Then I should see the course with id 12
  And within it I should see the text "Data Structures"