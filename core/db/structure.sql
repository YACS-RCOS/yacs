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
 * @10/30/18 - Updated to only compare sections in the same term
 * @author Ada Young
 * @param section_id [integer] id of the section in question
 * @return [integer[]] an array containing the ids of any sections that confict
 *   with the section given by `section_id`
 */
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
    LEFT OUTER JOIN listings ON listings.term_id = terms.id
    LEFT OUTER JOIN sections ON sections.listing_id = listings.id
    WHERE sections.id = section_id;
  SELECT * INTO this_section FROM sections WHERE sections.id = section_id;
  <<section_loop>>
  FOR other_section IN
    SELECT * FROM sections
      LEFT OUTER JOIN listings ON listings.id = sections.listing_id
      LEFT OUTER JOIN terms ON terms.id = listings.term_id
      WHERE sections.listing_id != this_section.listing_id
      AND terms.id = this_term_id
  LOOP
    conflict_found := 'false';
    <<outer_period_loop>>
    FOR this_section_period IN SELECT * FROM jsonb_array_elements(this_section.periods) LOOP
      <<inner_period_loop>>
      FOR other_section_period IN SELECT * FROM jsonb_array_elements(other_section.periods) LOOP
        IF (this_section_period->>'day' = other_section_period->>'day'
          AND (((this_section_period->>'start')::NUMERIC <= (other_section_period->>'start')::NUMERIC AND (this_section_period->>'end')::NUMERIC >= (other_section_period->>'start')::NUMERIC)
          OR ((this_section_period->>'start')::NUMERIC >= (other_section_period->>'start')::NUMERIC AND (this_section_period->>'start')::NUMERIC <= (other_section_period->>'end')::NUMERIC)))
        THEN
          conflict_ids := conflict_ids || other_section.id;
          conflict_found := 'true';
        END IF;
        EXIT inner_period_loop WHEN conflict_found IS TRUE;
      END LOOP inner_period_loop;
      EXIT outer_period_loop WHEN conflict_found IS TRUE;
    END LOOP outer_period_loop;
  END LOOP section_loop;
  RETURN conflict_ids;
END;
$$ LANGUAGE plpgsql;
