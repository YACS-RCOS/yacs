# This function takes in the term_shortname as a string
# and then returns a query string to send to the API

def get_query(term_shortname): #In the format YYYYTT
  year = term_shortname[:-2]
  term = term_shortname[4:]. #SP = spring, FA = fall, SU = summer, WI = winter

  # As a shortcut, we can use limit=0 to get all of the courses
  return "?limit=0&year=" + year + "&term=" + term
