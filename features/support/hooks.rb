AfterStep('@pause') do
  print "Press Return to continue ..."
  STDIN.getc
end

AfterStep('@delay') do
  sleep(1)
end

# Before('@javascript') do
#   page.driver.browser.manage.window.resize_to(768, 1024)
# end