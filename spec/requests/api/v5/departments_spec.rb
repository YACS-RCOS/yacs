describe 'Departments API' do
  it '#index' do
    FactoryGirl.create_list(:department, 10)
    get '/api/v5/departments'
    expect(response).to be_success
    expect(json['result'].length).to eq 10
    Department.all.each_with_index do |dept, n|
      expect(json['result'][n]['code']).to eq dept.code
      expect(json['result'][n]['name']).to eq dept.name
    end
  end

  it '#show' do
    dept = FactoryGirl.create(:department)
    get "/api/v5/departments/#{dept.id}"
    expect(response).to be_success
    expect(json['result']['id']).to eq dept.id
    expect(json['result']['code']).to eq dept.code
    expect(json['result']['name']).to eq dept.name
  end
end