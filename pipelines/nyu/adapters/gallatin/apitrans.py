from globals import API_URL

def get_query(term_shortname): #In the format YYYYTT
	global API_URL
	year = term_shortname[:-2]
	term = term_shortname[4:]  #SP = spring, FA = fall, SU = summer, WI = winter

    # As a shortcut, we can use limit=0 to get all of the courses
	return API_URL+ "?limit=0&year=" + year + "&term=" + term
