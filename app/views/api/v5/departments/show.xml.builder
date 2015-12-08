xml.instruct!
xml.tag! 'department' do
  xml.tag! 'department-id', @department.id
  xml.tag! 'department-code', @department.code
  xml.tag! 'department-name', @department.name
end
