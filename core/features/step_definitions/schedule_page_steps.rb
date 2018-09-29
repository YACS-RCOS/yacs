Given(/^a section as such:?$/) do |table|
  step "the sections as such:", table
end

Given(/^the sections as such:?$/) do |table|
  header = table.raw[0]
  data = table.raw[1..-1]
  data.each do |row|
    opts = header.zip(row).to_h
    opts.each do |key,value|
      innerValue = value[/(?<=\[)[\w\'\"]+(,[\w\'\"]+)*(?=\])/]
      opts[key] = innerValue ? innerValue.split(',') : value
    end
    FactoryGirl.create(:section_with_periods,opts)
  end
end

And(/^I should see (.*) schedule events?$/) do |num|
  expect(page).to have_css("schedule-event", count:num)
end

And(/^I should see a (.*) with text "(.*)"$/) do |elem, text|
  expect(page.all(elem, text: text)).not_to be_empty
end

Then(/^I should see the (.*) with id (\d+) is selected$/) do |type, id|
  css = "#{type.downcase}[data-id='#{id}']"
  expect(page).to have_css("#{css}.selected")
end

Then(/^I should see the (.*) with id (\d+) is not selected$/) do |type, id|
  css = "#{type.downcase}[data-id='#{id}']"
  expect(page).to have_no_css("#{css}.selected")
end
