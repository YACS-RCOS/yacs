When(/^I click the (.*) "(.*)"$/) do |elem, text|
  find(elem).find('*', text: text).click
end