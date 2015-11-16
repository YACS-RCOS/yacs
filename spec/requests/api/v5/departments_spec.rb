describe 'Departments API' do
  it '#index' do
    FactoryGirl.create_list(:department, 10)
    get '/api/v5/departments.json'
    expect(response).to be_success
    expect(json['departments'].length).to eq 10
    Department.all.each_with_index do |dept, n|
      expect(json['departments'][n]['department']['code']).to eq dept.code
      expect(json['departments'][n]['department']['name']).to eq dept.name
    end
  end

  it '#index?use_schools=1' do
    depts = FactoryGirl.create_list(:department, 2)
    school = FactoryGirl.create(:school)
    depts[0].school = school
    depts[0].save!
    get '/api/v5/departments.json?use_schools=1'
    expect(response).to be_success
    expect(json['departments']).to be_present
    expect(json['departments'].length).to eq 1
    expect(json['departments'][0]['department']['code']).to eq depts[1].code
    expect(json['departments'][0]['department']['name']).to eq depts[1].name
    expect(json['schools']).to be_present
    expect(json['schools'].length).to eq 1
    expect(json['schools'][0]['school']['name']).to eq school.name
  end

  it '#show' do
    dept = FactoryGirl.create(:department)
    get "/api/v5/departments/#{dept.id}.json"
    expect(response).to be_success
    expect(json['department']['id']).to eq dept.id
    expect(json['department']['code']).to eq dept.code
    expect(json['department']['name']).to eq dept.name
  end
end