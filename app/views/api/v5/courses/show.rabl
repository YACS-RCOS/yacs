object @course
attributes :id, :name, :number, :min_credits, :max_credits
child(:department) { attributes :id, :code }