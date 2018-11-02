import pandas as pd
import json

SUBJECTS = ['Interdisciplinary Seminars (IDSEM-UG)',
       'Advanced Writing Courses (WRTNG-UG)', 'Arts Workshops (ARTS-UG)',
       'Individualized Projects  (INDIV-UG)',
       'Global Programs (INDIV-UG)',
       'First-Year Program: Writing Seminars (FIRST-UG)',
       'Global Programs (PRACT-UG)', 'Graduate Core (CORE-GG)',
       'Leaves and Sabbaticals (LEAVE-XX)',
       'Graduate Electives (ELEC-GG)', 'Global Programs (WRTNG-UG)',
       'First-Year Program: Interdisciplinary Seminars (FIRST-UG)',
       'Global Programs (SASEM-UG)', 'Travel Courses  (TRAVL-UG)',
       'Individualized Projects  (INDIV-GG)',
       'Global Programs (IDSEM-UG)', 'Practicum (PRACT-UG)',
       'Colloquium (COLLQ-UG)',
       'First-Year Program: Transfer Student Research Seminar (FIRST-UG)',
       'Community Learning Courses (CLI-UG)']
	   # TODO extract all the subject names and make them into a list for easier access
SUBJECTS_LONG = ['Interdisciplinary Seminars', 'Advanced Writing Courses',
				'Arts Workshops', 'Individualized Projects ', 'Global Programs',
				'First-Year Program: Writing Seminars', 'Global Programs',
				'Graduate Core', 'Leaves and Sabbaticals', 'Graduate Electives',
				'Global Programs', 'First-Year Program: Interdisciplinary Seminars',
				'Global Programs', 'Travel Courses ', 'Individualized Projects ',
				'Global Programs', 'Practicum', 'Colloquium',
				'First-Year Program: Transfer Student Research Seminar',
				'Community Learning Courses']

SUBJECTS_SHORT = ['IDSEM', 'WRTNG', 'ARTS', 'INDIV',
				'INDIV', 'FIRST', 'PRACT', 'CORE',
				'LEAVE', 'ELEC', 'WRTNG', 'FIRST',
				'SASEM', 'TRAVL', 'INDIV', 'IDSEM',
				'PRACT', 'COLLQ', 'FIRST', 'CLI']

SUBJECT_IS_UG = [True, True, True, True, True, True,
				True, False, False, False, True, True,
				True, True, False, True, True, True, True, True]

def format_data(unformatted_json):
	# This function takes in a JSON string in the API's format
	# and returns a JSON string in Yacs format

	df = get_df(unformatted_json)

	# For testing purposes only
	df['description'] = df['description'].str[0]
	return df
	# TODO Rename all the columns

	# TODO Use pivot to reformat the data rows

	# Original
	# Index(['course', 'credit', 'days', 'days2', 'description',
	#    'foundation-libarts', 'instructors', 'level', 'notes', 'section',
	#    'term', 'times', 'title', 'type', 'year'],
	#   dtype='object')
	# https://stackoverflow.com/questions/40470954/convert-pandas-dataframe-to-nested-json
	# https://stackoverflow.com/questions/46205399/how-to-generate-n-level-hierarchical-json-from-pandas-dataframe
	j = (df.groupby(['ID','Location','Country','Latitude','Longitude'], as_index=False)
	     .apply(lambda x: x[['timestamp','tide']].to_dict('r'))
		.reset_index()
         .rename(columns={0:'Tide-Data'})
         .to_json(orient='records'))



	# Desired
	# "subjects": [
	# 	{
	# 	"shortname": "ARTS-UG","longname": "Arts Workshops",
	# 	"listings": [
	# 			{
	# 				"shortname": "1485","longname": "FullCourseName","min_credits": 4,"max_credits": 4,
	# 				"description": "Course desc"
	# 				"sections": [
	# 					"shortname": "001",
	# 					"periods": [
	# 						{...}
	# 					]
	# 				]
	# 			}
	# 		]
	# 	},
	# 	{
	# 		"shortname": "IDSEM-UG","longname": "Interdisciplinary Seminars",
	# 		"listings": [
	# 			...
	# 		]
	# 	}
	# ]

	# # Formatting Gallatin data to final data
	# subjects = [] # TODO Build subjects list
	# gallatin = {'longname': 'Gallatin','shortname': 'gallatin','subjects':subjects}
	# data = {'schools':[gallatin]}
	# return json.dumps(data)

def get_df(raw_json):
	# Read in data, and drop the 'totalMatches' row
	df = pd.read_json(raw_json, orient = 'index') # Read in data
	df = df.drop('totalMatches',axis=0) # Drop 'totalMatches'
	df.index = pd.to_numeric(df.index) # Reformat index
	return df

# Below functions probably no longer useful
def _shorten_desc(json_obj):
	if 'course' in json_obj:
		del json_obj['description']
		json_obj['instructors'] = str(json_obj['instructors'])
	return json_obj

def load(json_data):
	return json.loads(json_data)

def to_list(raw_json):
	del raw_json['totalMatches']
	data = []
	for key,value in raw_json.items():
		data.append(value)
	return data

def filter_results(unfiltered_json):
	# This will use exclusively the pandas package
	# if this can be done more efficiently with json,
	# it will use that instead.
	return "filtered JSON"
