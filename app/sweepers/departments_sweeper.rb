class DepartmentsSweeper < BaseSweeper
  observe School, Department

  def expire_data record
    super record
    expire_page "/api/v5/departments.xml"
  end
end