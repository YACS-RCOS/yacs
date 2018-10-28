import pandas as pd
import json

SUBJECTS = None # TODO extract all the subject names and make them into a list for easier access


def format_data(unformatted_json):
	# This function takes in a JSON string in the API's format
	# and returns a JSON string in Yacs format

	# TODO Figure out how to divide work
	# between into pandas and json effectively
	# data = load(unformatted_json)
	# del data['totalMatches']

	# Read in data, and drop the 'totalMatches' row
	df = pd.read_json(unformatted_json, orient = 'index') # Read in data
	df = df.drop('totalMatches',axis=0) # Drop 'totalMatches'
	df.index = pd.to_numeric(df.index) # Reformat index

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


	# Desired
	# "subjects": [
	# 	{
	# 	"shortname": "ARTS-UG","longname": "Arts Workshops",
	# 	"listings": [
	# 			{
	# 				"shortname": "1485","longname": "FullCourseName","min_credits": 4,"max_credits": 4,
	# 				"description": "This course covers the very basic techniques of photography and digital imaging. Beyond Picture Perfect explores the many choices available to today\u2019s image makers. New technology combined with traditional photographic techniques will be addressed, enabling the students to realize their distinctive image-making vocabulary..."
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
