And(/^I should see (.*) schedule events$/) do |num|
  #use css to find all '#schedule-event' and count equal to num
end

Then(/^I should see the (.*) with id (\d+) is selected$/) do |type, id|
	css = "#{type.downcase}[data-id='#{id}']"
	expect(page).to have_css("#{css}.selected")
end
