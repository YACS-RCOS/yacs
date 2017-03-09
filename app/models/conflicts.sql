ActiveRecord::Base.connection.execute("

CREATE OR REPLACE FUNCTION CONFLICT_IDS (section_id INTEGER) RETURNS INTEGER ARRAY AS $$
DECLARE
  i INTEGER := 0;
  j INTEGER := 0;
  this_section RECORD;
  other_section RECORD;
  conflict_ids INTEGER[] := '{}';
  conflict_found BOOLEAN;
BEGIN
  SELECT * INTO this_section FROM sections where sections.id = section_id;
  FOR other_section IN SELECT * FROM sections WHERE sections.course_id != this_section.course_id
  LOOP
    conflict_found := 'false';
    i := 0;
    WHILE i < this_section.num_periods AND conflict_found = 'false' LOOP
      j := 0;
      WHILE j < other_section.num_periods AND conflict_found = 'false' LOOP
        IF (this_section.periods_day[i] = other_section.periods_day[j]
          AND ((this_section.periods_start[i] <= other_section.periods_start[j] AND this_section.periods_end[i] >= other_section.periods_start[j])
          OR (this_section.periods_start[i] >= other_section.periods_start[j] AND this_section.periods_start[i] <= other_section.periods_end[j])))
        THEN
          conflict_ids := conflict_ids || other_section.id;
          conflict_found := 'true';
        END IF;
        j := j + 1;
      END LOOP;
      i := i + 1;
    END LOOP;
  END LOOP;
  RETURN conflict_ids;
END;
$$ LANGUAGE plpgsql;")

-- CREATE OR REPLACE FUNCTION CONFLICTS (id INTEGER) RETURNS BOOLEAN ARRAY AS $$


  --       IF (this_section.periods_day[i] == other_section.periods_day[j]
  --         && ((this_section.periods_start[i].to_i <= other_section.periods_start[j] && this_section.periods_end[i].to_i >= other_section.periods_start[j])
  --         || (this_section.periods_start[i].to_i >= other_section.periods_start[j] && this_section.periods_start[i].to_i <= other_section.periods_end[j])))


  -- SELECT * FROM (
  --   SELECT DISTINCT
  --     SELECT * into section FROM sections WHERE sections.id = #{id} 
  --     i := 0;
  --     WHILE (i < section.num_periods)
  --     LOOP
  -- ) conflict
  -- WHERE conflict = true


        IF (this_section.periods_day[i] == other_section.periods_day[j]
          AND ((this_section.periods_start[i].to_i <= other_section.periods_start[j] && this_section.periods_end[i].to_i >= other_section.periods_start[j])
          OR (this_section.periods_start[i].to_i >= other_section.periods_start[j] && this_section.periods_start[i].to_i <= other_section.periods_end[j])))