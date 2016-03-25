Feature: Home Page
  In order to find courses
  As a user
  I would like to view departments on the home page

Scenario: visits the home page
  When I go to the home page
  Then I should see the text "YACS beta"

Scenario: views departments
  Given the following schools exist:
    | id | name                  |
    | 1  | School of Engineering |
    | 2  | School of Science     |
  And the following departments exist:
    | code | name                   | school_id |
    | CIVL | Civil Engineering      | 1         |
    | CHME | Chemical Engineering   | 1         |
    | CSCI | Computer Science       | 2         |
    | BIOL | Biology                | 2         |
  When I go to the home page
  Then I should see "CIVL" within "school[data-id=1]"