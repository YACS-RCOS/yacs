When(/^I go to (.+)$/) do |page_name|
  visit path_to page_name
end

Then(/^I should see the text "(.*?)"$/) do |text|
  expect(page).to have_content text
end

Then(/^I should see the (.*) with id (\d+)$/) do |type, id|
  @root = "#{type.downcase}[data-id='#{id}']"
  @children = []
  expect(page).to have_css(@root)
end

Then(/^within it I should see the (.*) with id (\d+)$/) do |type, id|
  @children.push "#{type.downcase}[data-id='#{id}']"
  expect(page).to have_css("#{@root} #{@children.join(' ')}")
end

And(/^(?:within it )?I should also see the (.*) with id (\d+)$/) do |type, id|
  css = "#{type.downcase}[data-id='#{id}']"
  expect(page).to have_css("#{@root} #{@children[0..-2].join(' ')} #{css}")
end

And(/^within it I should see the text "(.*)"$/) do |text|
  css = "#{@root} #{@children.join(' ')}"
  expect(page.find(css)).to have_content text
end

And(/^(?:within it )?I should also see the text "(.*)"$/) do |text|
  css = "#{@root} #{@children[0..-2].join(' ')}"
  expect(page.find(css)).to have_content text
end

And(/I break$/) do
  binding.pry
end
