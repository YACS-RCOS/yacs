import pandas as pd
import json
import re
import copy

def format_data(unformatted_json): # Probably should also pass a reference to the output file from server instance
	# This function takes in a JSON string in the API's format
	# and returns a JSON string in Yacs format
	df = get_df(unformatted_json) # Get a pandas dataframe to do operations on
	df = format_df(df)
	subject_list = []
	append_subjects(subject_list,df)
	gallatin = {'longname': 'Gallatin','shortname': 'gallatin','subjects':subject_list}
	data = {'schools':[gallatin]}
	return json.dumps(data)

# Maybe improve this in the future using a list comprehension?
def append_subjects(subject_list,df):
	# https://pandas.pydata.org/pandas-docs/stable/groupby.html#iterating-through-groups
	# Use groupby for efficiency
	grp_by_subject = df.groupby('subject_shortname')
	for shortname, group in grp_by_subject:
		sub_dict = {}
		sub_dict['shortname'] = shortname
		sub_dict['longname'] = group['subject_longname'].iloc[0]
		listings = []
		append_sections(listings,group.copy())
		sub_dict['listings'] = listings
		subject_list.append(sub_dict)

def append_sections(listings, df):
	grp_by_section = df.groupby('course_shortname')
	for shortname, group in grp_by_section:
		section_dict = {}
		# print(group['title'])
		# print(group.shape)
		section_dict['shortname'] = shortname
		section_dict['longname'] = group['title'].iloc[0]
		section_dict['min_credits'] = group['credit'].iloc[0]
		section_dict['max_credits'] = group['credit'].iloc[0]
		section_dict['description'] = group['description'].iloc[0]
		section = {}
		section['shortname'] = shortname
		section['crn'] = shortname
		periods = []
		append_periods(periods,group)
		section['periods'] = periods
		section_dict['sections'] = [section]
		listings.append(section_dict)

def append_periods(periods,df):
	days = df['days'].iloc[0]
	days2 = df['days2'].iloc[0]
	times = df['times'].iloc[0]
	times2 = df['times2'].iloc[0]

# "periods": [ // optional, but needed for scheduling
#   {
# 	"day": 1, // required, day of week (Sunday = 0, Saturday = 6)
# 	"start": "1200", // required, start time (24hr)
# 	"end": "1450", // required, end time (24hr)
# 	"type": "lecture" // optional, but please be consistent in naming if used
# 	"location": "DCC 328" // optional, but please abbreviate if used
#   }
# ]

def get_df(raw_json):
# Read in data, and do some simple formatting
	# Read in data
	df = pd.read_json(raw_json, orient = 'index')
	# For testing purposes only
	# df['description'] = df['description'].str[0:5]
	# Drop useless columns
	df = df.drop(['term','year','level'],axis = 1)
	# Drop these two columns because they're annoying and IDK what to do with them
	for name in ['foundation-histcult','foundation-libarts','syllabus']:
		if name in df.columns:
			df = df.drop(name,axis = 1)
	# Drop 'totalMatches' - it's not a record
	df = df.drop('totalMatches',axis=0)
	# To make it easier to work with, remove empty strings, None, and the like
	df = df.replace(r'^\s*$',pd.np.nan,regex=True).fillna(value=pd.np.nan)
	# Reset index to integers (so that formatting doesn't screw up randomly)
	df = df.reset_index(drop=True)
	return df

def format_df(df):
	# Filter out global courses
	
	# Preformats a series to be used for filtering
	type_col = df['type'].str.strip().str.lower()
	# Filter out those global courses using a mask
	df = df[type_col.str.startswith('global') == False].copy()
	del type_col # No longer need the series

	# Format columns

	# Replace 'type' with 'subject_longname'
	# 'type' is formatted as :longname: (:shortname:-:level:)
	type_parts = df['type'].str[:-1].str.split(r"\s*\(", n = 1, expand = True)
	# Make the subject longname column
	df['subject_longname'] = type_parts[0]
	# Remove the 'type' column
	df = df.drop('type',axis = 1)
	del type_parts # we don't need this anymore

	# Remove 'LEAVE-XX11' - It's not a class
	leave_course_mask = df['course'] != 'LEAVE-XX11'
	df = df[leave_course_mask]

	# Replace course with 'subject_shortname' and 'course_id'
	# Change course into course shortname and course id
	course_parts = df['course'].str.split(r'(?<=[A-Z])G(?=[0-9])',n=1,expand=True)
	df['subject_shortname'] = course_parts[0]
	df['course_shortname'] = course_parts[1] # Coerce to numeric?
	df = df.drop('course',axis = 1)

	# Sort df so that we can directly append to list
	# Group by type first, then within each type group by course name
	df = df.sort_values(['subject_shortname','course_shortname'])
	df = df.reset_index(drop=True)
	return df
