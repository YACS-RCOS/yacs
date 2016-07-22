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
    | id | number | name            | department_id |
    | 12 |   1200 | Data Structures |             6 |

@javascript
@delay
Scenario: view courses
  Given I go to the home page
  When I click the department "CSCI"
  Then I should see the course with id 12
  And within it I should see the text "Data Structures"

@javascript
@delay
Scenario: no viewport size change with zero, short, and overflowing descriptions
  Given setup course descriptions as such and go to courses page:
  | id | number | name                 | department_id | description_length |
  | 18 | 1400   | twoLineDescription   | 6             | 122                |
  | 19 | 1500   | threeLineDescription | 6             | 123                |
  Then the show hide button of course with id 12 should be hidden
   And the show hide button of course with id 18 should be hidden
   And the show hide button of course with id 19 should be visible
  Then the description of course with id 12 should NOT be truncated
   And the description of course with id 18 should NOT be truncated
   And the description of course with id 19 should be truncated

@javascript
@delay
Scenario: viewport shrinks with zero, short, and overflowing descriptions
  Given setup course descriptions as such and go to courses page:
    | id | number | name             | department_id | description_length |
    | 18 | 1400   | shortDescription | 6             | 122                |
    | 19 | 1500   | longDescription  | 6             | 123                |
  When I shrink the browser horizontally
  Then the show hide button of course with id 12 should be hidden
   And the show hide button of course with id 18 should be visible
   And the show hide button of course with id 19 should be visible
  Then the description of course with id 12 should NOT be truncated
   And the description of course with id 18 should be truncated
   And the description of course with id 19 should be truncated

@javascript
@delay
Scenario: viewport expands with zero, short, and overflowing descriptions
  Given setup course descriptions as such and go to courses page:
    | id | number | name             | department_id | description_length |
    | 18 | 1400   | shortDescription | 6             | 122                |
    | 19 | 1500   | longDescription  | 6             | 123                |
  When I expand the browser horizontally
  Then the show hide button of course with id 12 should be hidden
   And the show hide button of course with id 18 should be hidden
   And the show hide button of course with id 19 should be hidden
  Then the description of course with id 12 should NOT be truncated
   And the description of course with id 18 should NOT be truncated
   And the description of course with id 19 should NOT be truncated

@javascript
@delay
Scenario: viewport maximizes with zero, short, and overflowing descriptions
  Given setup course descriptions as such and go to courses page:
    | id | number | name             | department_id | description_length |
    | 18 | 1400   | shortDescription | 6             | 122                |
    | 19 | 1500   | longDescription  | 6             | 123                |
  When I maximize the browser
  Then the show hide button of course with id 12 should be hidden
   And the show hide button of course with id 18 should be hidden
   And the show hide button of course with id 19 should be hidden
  Then the description of course with id 12 should NOT be truncated
   And the description of course with id 18 should NOT be truncated
   And the description of course with id 19 should NOT be truncated

@javascript
@delay
Scenario: user toggles course description truncation using show-hide-button
  Given setup course descriptions as such and go to courses page:
    | id | number | name                   | department_id | description_length |
    | 18 | 1400   | overflowingDescription | 6             | 123                |
  Then the show hide button of course with id 18 should be visible
    And I should see a show-hide-button with text "show"
    And the description of course with id 18 should be truncated
  When I click the show-hide-button "show"
  Then the show hide button of course with id 18 should be visible
    And I should see a show-hide-button with text "hide"
    And the description of course with id 18 should NOT be truncated
  When I click the show-hide-button "hide"
  Then the show hide button of course with id 18 should be visible
    And I should see a show-hide-button with text "show"
    And the description of course with id 18 should be truncated

@javascript
@delay
Scenario: description should remain open unless it no longer overflows
  Given setup course descriptions as such and go to courses page:
    | id | number | name                   | department_id | description_length |
    | 18 | 1400   | overflowingDescription | 6             | 300                |
  When I click the show-hide-button "show"
  Then I should see a show-hide-button with text "hide"
    And the description of course with id 18 should NOT be truncated
  When I shrink the browser horizontally
  Then I should see a show-hide-button with text "hide"
    And the description of course with id 18 should NOT be truncated
  When I expand the browser horizontally
  Then I should see a show-hide-button with text "hide"
    And the description of course with id 18 should NOT be truncated
