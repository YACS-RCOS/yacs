class Catalog::AbstractAdapter
  def load_catalog
    raise "ERROR: Implementation Required"
  end

  def update_section_seats
    raise "ERROR: Implementation Required"
  end
end