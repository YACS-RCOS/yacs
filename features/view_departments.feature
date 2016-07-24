Feature: Home Page
  In order to find courses
  As a user
  I would like to view departments on the home page

@javascript
Scenario: visits the home page
  When I go to the home page
  Then I should see the text "YACS beta"

@javascript
Scenario: views departments
  Given the following schools exist:
    | id | name                  |
    | 1  | School of Engineering |
    | 2  | School of Science     |
  And the following departments exist:
    | id | code | name                   | school_id |
    | 6  | CIVL | Civil Engineering      | 1         |
    | 7  | CHME | Chemical Engineering   | 1         |
    | 8  | CSCI | Computer Science       | 2         |
    | 9  | BIOL | Biology                | 2         |
  When I go to the home page
  Then I should see the school with id 1
    Then within it I should see the text "School of Engineering"
    And I should also see the department with id 6
      Then within it I should see the text "CIVL"
      And I should also see the text "Civil Engineering"
    And I should also see the department with id 7
  Then I should see the school with id 2
    Then within it I should see the text "School of Science"
    And within it I should see the department with id 8
      Then within it I should see the text "CSCI"
      And I should also see the text "Computer Science"
    And I should also see the department with id 9
