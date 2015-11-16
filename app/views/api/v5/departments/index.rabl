object false
child(@schools) do
  attributes :id, :name
  child(:departments) do
    extends "api/v5/departments/show"
  end
end
child(@departments) do
  extends "api/v5/departments/show"
end