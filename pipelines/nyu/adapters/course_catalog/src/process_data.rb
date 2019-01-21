require 'pry'

# List of courses for a subject
def extract_listings html
	elements = html.children
	elements[0] = Hash.new { |h,k| h[k] = [] }
	elements.inject do |first, second|
		nil
	end
	html
end

def parse_header div_tag

end

def parse_section a_tag

end

{
    "schools": [
        {
            "longname": "Gallatin",
            "shortname": "gallatin"
            "subjects": [
                {
                    "shortname": "ARTS-UG",
                    "longname": "Arts Workshops",
                    "listings": [
                      {
                          "shortname": "1485",
                          "longname": "Beyond Picture Perfect: Personal Choice in a Digital World",
                          "min_credits": 4,
                          "max_credits": 4,
                          "description": "This course covers the very basic techniques of photography and digital imaging. Beyond Picture Perfect explores the many choices available to today\u2019s image makers. New technology combined with traditional photographic techniques will be addressed, enabling the students to realize their distinctive image-making vocabulary...",
                          "crn":"",
                          "sections": [
                              shortname: "001",
                              periods: [
                                  {
                                      ...
                                  }
                              ]
                          ]
                      }
                    ]
                },
                {
                    "shortname": "IDSEM-UG",
                    "longname": "Interdisciplinary Seminars",
                    "listings": [
                        ...
                    ]
                }
            ]
        }
    ]
}
