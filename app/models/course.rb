class Course < ActiveRecord::Base
  belongs_to :department
  has_many   :sections, dependent: :destroy
  validates  :number, presence: true, uniqueness: { scope: :department_id }
  default_scope { order(number: :asc) }
  
  searchable do #searchable block required by sunspot (specifies which fields to index and search on)
    text :number, :name, :description
  end

  def self.get code, number
    joins(:department).where("departments.code = ? AND number = ?", code, number).first
  end

  #Returns the result of a string search using sunspot_solr (formerly using SQL Query)
  #params: a list of string search terms (split by whitespace from user search text)
  def self.search params, numberFilter
    courses = Sunspot.search(Course) do
      fulltext params do
	    fields(:description, :number => 5, :name => 10) #weight results most strongly by name, then number, and finally description
	    phrase_fields :name => 3.0 #weight titles that contain a phrase of search terms more strongly
	  end
	  paginate :page => 1, :per_page => 25 #place a maximum of 25 results on each page (for now we just display page 1)
    end.results #store results of search in courses
	
	#filter by section on the front end for the time being
	filterBounds = numberFilter.to_s.tr('["]', '').split(':') #convert filter arg to string, removing brackets and double quotes
	#ensure that there are either 1 or 2 bounds and both are valid numbers before comparing against them
	filterBounds.each { |e| (e = e.to_s)}
	if (filterBounds.length == 2 && filterBounds[0].length && filterBounds[1].length && 
	filterBounds[0].to_i.to_s == filterBounds[0] && filterBounds[1].to_i.to_s == filterBounds[1])
		#there are two bounds, so treat them as a min and max (inclusive) for course number
		courses.delete_if { |x| (x.number < filterBounds[0].to_i || x.number > filterBounds[1].to_i) }
	elsif (filterBounds.length == 1 && filterBounds[0].length && filterBounds[0].to_i.to_s == filterBounds[0])
		#there is only one bound, so treat it as a filter by most-significant digit (eg. 4000 = between 4000 and 4999)
		courses.delete_if { |x| (x.number.div(10 ** (filterBounds[0].length-1)) != filterBounds[0][0].to_i) }
	end
	
    ActiveRecord::Associations::Preloader.new.preload(courses, :sections)
    courses
  end

  def credits
    min_credits == max_credits ? "#{min_credits}" : "#{min_credits}-#{max_credits}"
  end
end
