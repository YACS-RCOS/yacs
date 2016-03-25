When /^I go to (.+)$/ do |page_name|
  visit path_to page_name
end

Then(/^I should see the text "(.*?)"$/) do |text|
  expect(page).to have_content text
end

