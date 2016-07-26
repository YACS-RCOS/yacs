And(/^I should see (.*) schedule events?$/) do |num|
  expect(page).to have_css("schedule-event", count:num)
end

Then(/^I should see the (.*) with id (\d+) is selected$/) do |type, id|
  css = "#{type.downcase}[data-id='#{id}']"
  expect(page).to have_css("#{css}.selected")
end

Then(/^I should see the (.*) with id (\d+) is not selected$/) do |type, id|
  css = "#{type.downcase}[data-id='#{id}']"
  expect(page).to have_no_css("#{css}.selected")
end
