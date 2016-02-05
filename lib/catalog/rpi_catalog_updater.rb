require 'open-uri'

class Catalog::RpiCatalogUpdater < Catalog::AbstractCatalogUpdater
  def update_section_seats
    get_sections.each do |section_xml|
      section = Section.find_by_crn(section_xml.attr("crn"))
      if section
        x = section.seats_taken
        section.seats = section_xml.attr("seats")
        section.seats_taken = section_xml.attr("students")
        section.save
      end
    end
  end

  def get_sections
    uri = "https://sis.rpi.edu/reg/rocs/YACS_201601.xml"
    Nokogiri::XML(open(uri)).xpath("//CourseDB/SECTION")
  end
end