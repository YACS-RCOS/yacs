/* Maintainer Instructions
 *
 * This purpose of this file is to house any custom plpgsql functions
 * or other "raw" postgresql code that is needed to configure the database.
 * 
 * Any changes or additions to such code should be handled via migration,
 * using `20171210212207_add_conflict_ids_procedure.rb` as an example.
 * 
 * This file is needed because although it is possible to execute "raw"
 * sql code in a migration, this is not reflected in the generated schema.rb,
 * which causes problems with testing and deployment.
 * 
 * As such, this file should contain any and all "raw" sql code necessary
 * to configure the database to the state of the **latest** migration.
 * 
 * If you are getting odd test failures that could be related to such a
 * misconfiguration, check to make sure any "raw" migrations are reflected
 * here as well.
 */

/* @1/3/18 - Function to compute all conflicting sections
 * @author Ada Young
 * @param section_id [integer] id of the section in question
 * @return [integer[]] an array containing the ids of any sections that confict
 *   with the section given by `section_id`
 */
CREATE OR REPLACE FUNCTION COMPUTE_CONFLICT_IDS (section_id INTEGER) RETURNS INTEGER ARRAY AS $$
DECLARE
  -- i INTEGER := 0;
  -- j INTEGER := 0;
  this_section RECORD;
  other_section RECORD;
  this_section_period jsonb;
  other_section_period jsonb;
  conflict_ids INTEGER[] := '{}';
  conflict_found BOOLEAN;
BEGIN
  SELECT * INTO this_section FROM sections WHERE sections.id = section_id;
  FOR other_section IN SELECT * FROM sections WHERE sections.listing_id != this_section.listing_id
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
  --   i := 1;
  --   WHILE i <= this_section.num_periods AND conflict_found = 'false' LOOP
  --     j := 1;
  --     WHILE j <= other_section.num_periods AND conflict_found = 'false' LOOP
  --       IF (this_section.periods_day[i] this_section.periods::json->'{i,day}' = other_section.periods_day[j]
  --         AND ((this_section.periods_start[i] <= other_section.periods_start[j] AND this_section.periods_end[i] > other_section.periods_start[j])
  --         OR (this_section.periods_start[i] >= other_section.periods_start[j] AND this_section.periods_start[i] < other_section.periods_end[j])))
  --       THEN
  --         conflict_ids := conflict_ids || other_section.id;
  --         conflict_found := 'true';
  --       END IF;
  --       j := j + 1;
  --     END LOOP;
  --     i := i + 1;
  --   END LOOP;
  -- END LOOP;
  RETURN conflict_ids;
END;
$$ LANGUAGE plpgsql;
