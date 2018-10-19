require 'csv'
require 'open-uri'

class TopicsCsvClient

  def initialize term_shortname
    @url = ENV["CSV_SOURCE_#{term_shortname}"]
  end

  def listings
    return [] unless @url
    content = open(@url).read
    csv = CSV.parse(content)
    listings = csv[1..-1].map{|row| Hash[csv[0].zip(row)]}.reject{|c| !c['subject'] || !c['number']}
    listings.map! do |listing|
      if listing['prerequisites']
        listing['description'] = "#{listing['description']} Prerequisites: #{listing['prerequisites']}"
      end
      listing['min_credits'] = listing['max_credits'] = listing['credits']
      listing['tags'] = ['topics']
      listing.compact!
      listing_numbers = listing['number'].split('/')
      listing_numbers.map{|number| listing.merge({'shortname' => number})}
    end
    listings.flatten!
  end

  def listings_by_subject
    subjects = {}
    listings.each do |listing|
      subjects[listing['subject']] ||= []
      subjects[listing['subject']] << listing
      listing.delete 'subject'
    end
    subjects.map { |k, v| { shortname: k, listings: v } }
  end
end
