Feature: Course Conflicts
  In order to efficiently plan my schedule
  As a user
  I would like to be shown conflicting courses on the course list

Background:
    Given the following schools exist:
      | id | name                  |
      | 1  | School of Engineering |
      | 2  | School of Science     |
    And the following departments exist:
      | id | code | name              | school_id |
      | 6  | CSCI | Computer Science  | 2         |
      | 7  | CIVL | Civil Engineering | 1         |
    And the following courses exist:
      | id | number | name                          | department_id |
      | 1  | 1100   | Computer Science I            | 6             |
      | 2  | 1200   | Data Structures               | 6             |
      | 30 | 4020   | How to Build Bridges          | 7             |
      | 31 | 4030   | Rotary Design and Maintenance | 7             |
    And the following sections exist:
      | id | name | course_id | num_periods | periods_day   | periods_start    | periods_end      |
      | 1  | 01   | 1         | 3           | {1,3,4}       | {800,1000,800}   | {950,1150,950}   |
      | 2  | 02   | 1         | 3           | {1,3,4}       | {800,1200,800}   | {950,1350,950}   |
      | 3  | 01   | 2         | 3           | {2,3,5}       | {1400,1000,1400} | {1550,1150,1550} |
      | 4  | 02   | 2         | 3           | {2,3,5}       | {1400,1100,1400} | {1550,1250,1550} |
      | 50 | 01   | 30        | 1           | {2}           | {1400}           | {1600}           |
      | 51 | 01   | 31        | 1           | {2}           | {1600}           | {1800}           |
      # note that some courses are a full 2 hours, not 1 hour 50 minutes.
      # section 4 contains a Wednesday section from 11-12:50 - not expected in real life, but will conflict with both sections 1 and 2 in the table.
      # Conflicts: 1/3, 1/4, 2/4, 3/50, 4/50
      # 51 should conflict with nothing.

@javascript
  Scenario: normal conflicts
    Given I go to the home page
      And I click the department "CSCI"
    When I click the section with id 4
    Then I should see that the section with id 1 is marked as conflicted
      And I should see that the section with id 2 is marked as conflicted

@javascript
  Scenario: conflicts with only some sections
    Given I go to the home page
      And I click the department "CSCI"
    When I click the section with id 3
    Then I should see that the section with id 1 is marked as conflicted
      And I should see that the section with id 2 is not marked as conflicted

@javascript
  Scenario: no conflicts with sections from the same course
    Given I go to the home page
      And I click the department "CSCI"
    When I click the section with id 3
    Then I should see that the section with id 4 is not marked as conflicted

@javascript
  Scenario: conflicts with courses in different departments
    Given I go to the home page
      And I click the department "CSCI"
      And I click the section with id 3
      And I go to the home page
    When I click the department "CIVL"
    Then I should see that the section with id 50 is marked as conflicted

@javascript
  Scenario: no conflicts when a period starts at the same time as another ends
    Given I go to the home page
      And I click the department "CIVL"
      And I click the section with id 50
    Then I should see that the section with id 51 is not marked as conflicted

