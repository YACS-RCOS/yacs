AfterStep('@pause') do
  print "Press Return to continue ..."
  STDIN.getc
end

AfterStep('@delay') do
  sleep(1)
end

AfterStep('@debug') do
  @id = @id || 0
  @id += 1
  page.save_screenshot("~/Desktop/screenshots/screenshot-#{@id}.png")
end

After('@debug') do |s|
  if s.failed?
    step 'I break'
  end
end

# Before('@javascript') do
#   page.driver.browser.manage.window.resize_to(768, 1024)
# end
