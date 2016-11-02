Then(/^I should see that the section with id (\d+) is marked as conflicted$/) do |id|
  css = "section.conflicts[data-id='#{id}']"
  expect(page).to have_css(css)
end

Then(/^I should see that the section with id (\d+) is not marked as conflicted$/) do |id|
  css = "section[data-id='#{id}']:not(.conflicts)"
  # better way to do this?
  expect(page.to_have_css(css))
end
