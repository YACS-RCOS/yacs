Given(/^setup course descriptions as such and go to courses page:$/) do |table|
  step 'the following courses with description:', table
  step 'I go to the home page'
  step 'I click the department "CSCI"'
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
  page.driver.browser.manage.window.resize_to(400, 1024)
end

When(/^I expand the browser horizontally$/) do
  page.driver.browser.manage.window.resize_to(1000, 1024)
end

When(/^I maximize the browser$/) do
  page.driver.browser.manage.window.maximize()
end
