describe 'Departments API' do
  it 'returns a list of departments' do
    FactoryGirl.create_list(:department, 10)

    get '/api/v5/departments'
    expect(response).to be_success
    expect(json['result'].length).to eq 10
    Department.all.each_with_index do |dept, n|
      expect(json['result'][n]['code']).to eq dept.code
      expect(json['result'][n]['name']).to eq dept.name
    end
  end
end