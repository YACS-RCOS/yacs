describe 'Departments API' do
  it '#index' do
    FactoryGirl.create_list(:department, 10)
    get '/api/v5/departments.xml'
    expect(response).to be_success
    expect(xml.root.departments.department.length).to eq 10
    Department.all.each_with_index do |dept, n|
      expect(xml.root.departments.department[n].search('department-code').text).to eq dept.code
      expect(xml.root.departments.department[n].search('department-name').text).to eq dept.name
    end
  end

  it '#index (with schools)' do
    depts = FactoryGirl.create_list(:department, 4)
    schools = FactoryGirl.create_list(:school, 2)
    depts[0].school = depts[1].school = schools[0]
    depts[0].save!; depts[1].save!
    get '/api/v5/departments.xml'
    expect(response).to be_success
    expect(xml.root.departments.try(:department)).to_not be_nil
    expect(xml.root.departments.department.length).to eq 2
    expect(xml.root.departments.department[0].search('department-code').text).to eq depts[2].code
    expect(xml.root.departments.department[0].search('department-name').text).to eq depts[2].name
    expect(xml.root.schools.try(:school)).to_not be_nil
    expect(xml.root.schools.school.length).to eq 2
    expect(xml.root.schools.school[0].search('school-name').text).to eq schools[0].name
    expect(xml.root.schools.school[0].departments.department[0].search('department-code').text).to eq depts[0].code
    expect(xml.root.schools.school[0].departments.department[0].search('department-name').text).to eq depts[0].name
  end

  it '#show' do
    dept = FactoryGirl.create(:department)
    get "/api/v5/departments/#{dept.id}.xml"
    expect(response).to be_success
    expect(xml.search('department-id').text).to   eq dept.id.to_s
    expect(xml.search('department-code').text).to eq dept.code
    expect(xml.search('department-name').text).to eq dept.name
  end
end