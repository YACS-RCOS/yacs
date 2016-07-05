When(/^I click the (.*) "(.*)"$/) do |elem, text|
  all(elem, text: text, count: 1)[0].click
end
