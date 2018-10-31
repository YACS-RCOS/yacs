class UpdateProcedureComputeConflictIds < ActiveRecord::Migration[5.1]
  def up
  	execute <<-SQL
			CREATE OR REPLACE FUNCTION COMPUTE_CONFLICT_IDS (section_id INTEGER) RETURNS INTEGER ARRAY AS $$
			DECLARE
			  this_term_id INTEGER;
			  this_section RECORD;
			  other_section RECORD;
			  this_section_period jsonb;
			  other_section_period jsonb;
			  conflict_ids INTEGER[] := '{}';
			  conflict_found BOOLEAN;
			BEGIN
			  SELECT terms.id INTO this_term_id FROM terms
			    INNER JOIN listings ON listings.term_id = terms.id
			    INNER JOIN sections ON sections.listing_id = listings.id
			    WHERE sections.id = section_id;
			  SELECT * INTO this_section FROM sections WHERE sections.id = section_id;
			  FOR other_section IN
			    SELECT * FROM sections
			      INNER JOIN listings ON listings.id = sections.listing_id
			      INNER JOIN terms ON terms.id = listings.term_id
			      WHERE sections.listing_id != this_section.listing_id
			      AND terms.id = this_term_id
			  LOOP
			    conflict_found := 'false';
			    FOR this_section_period IN SELECT * FROM jsonb_array_elements(this_section.periods) LOOP
			      FOR other_section_period IN SELECT * FROM jsonb_array_elements(other_section.periods) LOOP
			        IF (other_section_period->'day' = other_section_period->'day'
			          AND ((this_section_period->'start' <= other_section_period->'state' AND this_section_period->'end' > other_section_period->'start')
			          OR (this_section_period->'start' >= other_section_period->'start' AND this_section_period->'start' < other_section_period->'end')))
			        THEN
			          conflict_ids := conflict_ids || other_section.id;
			          conflict_found := 'true';
			        END IF;
			      END LOOP;
			    END LOOP;
			  END LOOP;
			  RETURN conflict_ids;
			END;
			$$ LANGUAGE plpgsql;
		SQL
  end

  def down
  	# If you need to reverse this for some reason you must do it manually.
  	# Having this function in a bad state will probably not cause a catastrophic failure.
  end
end
