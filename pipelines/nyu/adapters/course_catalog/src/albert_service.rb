class AlbertListingsService

	attr_reader :schools

	def initialize albert_client, term_shortname
		@albert_client = albert_client
		@term_shortname = term_shortname
		@schools = @albert_client.get_schools
		@subjects_map = build_listings_map @schools
		@tasks = []
		@new_listings = []
	end

	def start
		schools.each do |school|
			school[:subjects].each do |subject|
				task = listings_task school[:shortname], subject[:shortname]
				tasks << task
				task.execute
			end
		end
	end

	private

	def listings_task school_shortname, subject_shortname
		Concurrent::TimerTask.new do
			@albert_client.get_listings @term_shortname school_shortname, subject_shortname
		end
	end

	def sections_task
		Concurrent::TimerTask.new do
			listing = @new_listings.shift
			# @albert_client.get_section
		end
	end

	def build_listings_map schools
		subjects_map = {}
		schools.each do |school|
			school[:subjects].each do |subject|
				subjects_map[subject[:shortname]] = subject
			end
		end
	end

	class ListingsObserver
		def initialize subjects_map
			@subjects_map = subjects_map
		end

		def update time, listings, ex
			if listings
				listings.each do listing
					update_listing listing
				end
			elsif ex.is_a? Concurrent::TimeoutError
				# We timed out!
			else
				# Error :(
			end
		end

		def update_listing listing
		subject_shortname = listing.delete :subject_shortname
		if @subjects_map[subject_shortname].empty?
			# Add to new listings queue
		end
		@subjects_map[subject_shortname] = listing
	end
end
