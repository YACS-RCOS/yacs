Then(/^I should see that the section with id (\d+) is marked as conflicted$/) do |id|
  css = "section[data-id='#{id}'].conflicts"
  expect(page).to have_css(css)
end

Then(/^I should see that the section with id (\d+) is not marked as conflicted$/) do |id|
  css = "section[data-id='#{id}'].conflicts"
  # better way to do this?
  expect(page).to_not have_css(css)
end
