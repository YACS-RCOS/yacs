Feature: Schedule View
  In order to make a new schedule
  As a user
  I would like to clear selected courses

Background:
  Given the following schools exist:
  | id | name              |
  |  1 | School of Science |
  And the following departments exist:
  | id | code | name             | school_id |
  |  6 | CSCI | Computer Science |         1 |
  And the following courses exist:
  | id | number | name            | department_id |
  | 12 |   1200 | Data Structures |             6 |
  And the sections as such:
  | id | name |   crn | course_id | seats | seats_taken | num_periods | periods_day | periods_start      | periods_end         | periods_type     | instructors |
  | 18 |   01 | 25055 |        12 |    35 |          23 |           4 | 1,3,4,5     | 800,1000,1200,1400 | 1000,1100,1250,1415 | LEC,TEST,REC,LEC | a,b,c,d     |

@javascript
@delay
Scenario: clear courses
  Given I go to the home page
  And I click the department "CSCI"
  When I click the course "CSCI 1200"
  Then I should see the course with id 12 is selected
    And I should see the section with id 18 is selected
  #When I click the td "Schedule"
  #   Then I should see the text "clear"
  #   And I should see 4 schedule events
  #     And within it I should see the text "CSCI 1200 - 01"
  # When I click the clear button
  #   Then I should see 0 schedule events
  Then I break

