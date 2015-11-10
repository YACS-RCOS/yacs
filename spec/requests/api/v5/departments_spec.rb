describe 'Departments API' do
  it '#index' do
    FactoryGirl.create_list(:department, 10)
    get '/api/v5/departments.json'
    byebug
    expect(response).to be_success
    expect(json.length).to eq 10
    Department.all.each_with_index do |dept, n|
      expect(json[n]['code']).to eq dept.code
      expect(json[n]['name']).to eq dept.name
    end
  end

  it '#show' do
    dept = FactoryGirl.create(:department)
    get "/api/v5/departments/#{dept.id}.json"
    expect(response).to be_success
    expect(json['id']).to eq dept.id
    expect(json['code']).to eq dept.code
    expect(json['name']).to eq dept.name
  end
end