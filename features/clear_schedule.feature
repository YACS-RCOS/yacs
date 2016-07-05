Feature: Schedule View
  In order to make a new schedule
  As a user
  I would like to clear selected courses

Background:
  Given the following schools exist:
  | id | name              |
  | 1  | School of Science |
  And the following departments exist:
  | id | code | name             | school_id |
  | 6  | CSCI | Computer Science | 1         |
  And the following courses exist:
  | id | number | name            | department_id |
  | 12 | 1200   | Data Structures | 6             |
  And the sections as such:
  | id | name | course_id | num_periods | periods_day |
  | 18 | 01   | 12        | 3           | 1,3,4       |

@javascript
@delay
Scenario: clear courses
  Given I go to the home page
  And I click the department "CSCI"
  When I click the course "CSCI 1200"
  Then I should see the course with id 12 is selected
    And I should see the section with id 18 is selected
  When I click the tr "Schedule"
    Then I should see a #clearBtn with text "Clear"
  And I should see 3 schedule events
  When I click the #scheduleBar "Clear"
  Then I should see 0 schedule events
  When I click the tr "Schedule"
  Then I should see 0 schedule events
