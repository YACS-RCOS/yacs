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
    | id | name | course_id | num_periods | periods_day | seats | seats_taken |
    | 18 | 01   | 12        | 3           | [1,3,4]     | 20    | 5           |

@javascript
Scenario: clear courses no course conflict
  Given I go to the home page
    And I click the department "CSCI"
  When I click the course-info "CSCI 1200"
  Then I should see the course with id 12 is selected
    And I should see the section with id 18 is selected
  When I click "Schedule" in the header bar
  Then I should see a button with text "Clear"
    And I should see 3 schedule events
  When I click the button "Clear"
  Then I should see 0 schedule events
  When I click the tr "Schedule"
  Then I should see 0 schedule events

@javascript
Scenario: clear courses with course conflict
  Given the following courses exists:
    | id | number | name                            | department_id |
    | 13 | 2200   | Foundations of Computer Science | 6             |
  And a section as such:
    | id | name | course_id | num_periods | periods_day | periods_start | periods_end | periods_type |
    | 19 | 02   | 13        | 1           | [1]         | [900]         | [1000]      | ['LEC']      |
  Given I go to the home page
    And I click the department "CSCI"
  When I click the course-info "CSCI 1200"
  Then I should see the course with id 12 is selected
    And I should see the section with id 18 is selected
  When I click the course-info "CSCI 2200"
  Then I should see the course with id 13 is selected
    And I should see the section with id 19 is selected
  When I click "Schedule" in the header bar
    Then I should see a button with text "Clear"
    And I should see 0 schedule events
  When I click the button "Clear"
    And I go to the home page
    And I click the department "CSCI"
  Then I should see the course with id 12 is not selected
    And I should see the section with id 18 is not selected
    And I should see the course with id 13 is not selected
    And I should see the section with id 19 is not selected
