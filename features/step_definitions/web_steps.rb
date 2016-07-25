When(/^I click the (.*) "(.*)"$/) do |elem, text|
  # binding.pry
  find(elem, text: text).click
end

When(/^I click "(.*)" in the header bar$/) do |text|
  find(".sidelink", text: text).click
end
