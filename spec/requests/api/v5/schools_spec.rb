def json_validate_schools(schools=@schools, departments=false)
  schools.each_with_index do |school, n|
    ['id', 'name'].each do |field|
      expect(json['schools'][n][field]) .to eq school.attributes[field]
    end
    if departments
      school.departments.each_with_index do |department, m|
        expect(json['schools'][n]['departments'][m]['id']) .to eq department.id
      end
    else
      expect(json['schools'][n]['departments']) .to be_null
    end
  end
end

describe 'Schools API' do
  context 'there are schools with departments' do
    before do
      @schools = FactoryGirl.create_list(:school, 5)
      @departments = @schools.map do |school|
        FactoryGirl.create_list(:department, 5, school: school)
      end.flatten
    end

    it '#index.json' do
      get "/api/v5/schools.json"
      json_validate_schools(School.all)
    end

    it '#index.json?id=<:id>' do
      school = School.first
      get "/api/v5/schools.json?id=#{school.id}"
      json_validate_schools([school])
    end

    it '#index.json?id=<:id>,<:id>' do
      schools = School.limit(2)
      get "/api/v5/schools.json?id=#{schools[0].id},#{schools[1].id}"
      json_validate_schools(schools)
    end

    it '#index.json?show_departments=true' do
      get "/api/v5/schools.json?show_departments=true"
      json_validate_schools(School.all, true)
    end
  end
end