Given(/^setup course descriptions as such and go to courses page:$/) do |table|
  step 'the following courses with description:', table
  step 'set window to default size'
  step 'I go to the home page'
  step 'I click the department "CSCI"'
end

Given(/^set window to default size$/) do
  page.driver.resize_window(768, 1024)
end

Then(/^the show hide button of course with id (\d+) should be visible$/) do |id|
  expect(page.find("course[data-id='#{id}'] .show-hide-button")).to be_visible
end

Then(/^the show hide button of course with id (\d+) should be hidden$/) do |id|
  expect(page).not_to have_selector("course[data-id='#{id}'] .show-hide-button")
end

Then(/^the description of course with id (\d+) should be truncated$/) do |id|
  expect(page).to have_css("course[data-id='#{id}'] course-description.truncated")
end

Then(/^the description of course with id (\d+) should NOT be truncated$/) do |id|
  expect(page).to have_no_css("course[data-id='#{id}'] course-description.truncated")
end

When(/^I shrink the browser horizontally$/) do
  page.driver.resize(400, 1024)
end

When(/^I expand the browser horizontally$/) do
  page.driver.resize_window(1000, 1024)
end

When(/^I maximize the browser$/) do
  page.driver.resize_window(1600, 1024)
end
