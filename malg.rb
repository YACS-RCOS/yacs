class Malg
  def initialize

  end

  def build_graph
    graph = { 'schools' => [], 'departments' => [], 'courses' => [], 'sections' => [] }
    default_order = sources.sort { |a, b| priorities.default(a) <=> priorities.default(b) }

    processed_sources = []

    default_order.filter { |s| s.data['schools'] }.each do |source|
      processed_sources << source.name

      source.data['schools'].each do |ss|
        school = graph['schools'].detect { |gs| gs['name'] == ss['name'] }

        if school
          school['departments'] ||= []
          ss['departments'] ||= []
          ss['departments'].each do |sd|
            department = school['departments'].detect { |gd| gd['code'] == sd['code'] }

            if department
              department['courses'] ||= []
              sd['courses'] ||= []
              sd['courses'].each do |sc|
                course = department['courses'].detect { |gc| gc['number'] == sc['number'] }

                if course 
                  course['sections'] ||= []
                  sc['sections'] ||= []
                  sc['sections'].each do |ss|
                    section = course['sections'].detect { |gs| gs['name'] == ss['name'] }

                    if section
                      
                    else
                      course['sections'] << ss
                      graph['sections'] << ss
                    end
                  end
                else
                  department['courses'] << sc
                  graph['courses'] << sc
                end
              end
            else
              school['departments'] << sd
              graph['departments'] << sd
            end
          end
        else
          graph['schools'] << ss
        end
      end
    end
  end



  #    # graph['schools'] ||= source.data['schools']
  #         # school['departments'] = (school['departments'] || []) | (ss['departments'] || [])
  #         # 
  #   for 

  #   sources.sort(&:priority).each do |source|

  #   end



  #   graph = { 'schools' => {}, 'departments' => {}, 'courses' => {}, 'sections' => {} }

  #   for

  # end

  def pull_schools source

  end

  def update data

  end
end